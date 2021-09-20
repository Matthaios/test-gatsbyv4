import { useMutation, useQuery, useQueryClient } from "react-query";
import { loadStripe } from "@stripe/stripe-js";
import { Link, navigate } from "gatsby";

import BigNumber from "bignumber.js";

import JwtAuth from "@utils/JwtAuth";
import useNotification from "@utils/notifications";
import Cookies from "universal-cookie";
import useAuth from "./useAuth";
import { useOracle } from "./useOracle";
import { useMemo } from "react";

import { contractCheckoutManager, getGasPrice, getGasFee } from "@contracts";

import { v4 as uuidv4 } from "uuid";
import { CHECKOUT_MANAGER_ADDRESS } from "@contracts";

export default function useCart() {
  const cartKey = "cart";
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const notifications = useNotification();

  const cart = useMemo(() => {
    let c = typeof window !== "undefined" && localStorage.getItem(cartKey);
    if (c) {
      c = JSON.parse(c);
    }
    return c;
  }, [user]);

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      return cart ?? [];
    },
  });
  function addItem(item) {
    const auth = queryClient.getQueryData("auth");
    queryClient.setQueryData(["cart"], (items) => {
      if (Boolean(items?.find((i) => i?.edition_id == item?.edition_id))) {
        notifications.warning({
          text: "You already have this item in your cart!",
        });
        return items;
      } else {
        const data = items ? [item, ...items].filter(Boolean) : [item];
        localStorage.setItem(cartKey, JSON.stringify(data));
        return data;
      }
    });
  }
  function removeItem(item) {
    queryClient.setQueryData(["cart"], (items) => {
      const data = items.filter((i) => i.edition_id !== item.edition_id);
      localStorage.setItem(cartKey, JSON.stringify(data));
      return data;
    });
  }

  function isItemInCart(item) {
    return Boolean(query?.data?.find((i) => i.edition_id === item.edition_id));
  }
  function reset() {
    localStorage.removeItem(cartKey);
    queryClient.setQueryData(cartKey, []);
  }

  return {
    ...query,
    reset,
    addItem,
    removeItem,
    isItemInCart,
  };
}
export function useStripe() {
  const queryClient = useQueryClient();
  return useMutation(async (param) => {
    const transaction = await fetch(
      `${process.env.GATSBY_API_URL}/purchase/transaction`,
      {
        method: "POST",
        headers: {
          Authorization: JwtAuth.getToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(param),
      }
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "error") {
          queryClient.refetchQueries(["all-items"]);
          throw res.message;
        }
        return res;
      });
    return Promise.all([
      loadStripe(process.env.GATSBY_STRIPE_PK),
      transaction,
    ]).then(([stripe, { id: sessionId }]) => {
      return stripe.redirectToCheckout({
        sessionId,
      });
    });
  });
}

export function useMetamask() {
  const oracle = useOracle();
  const queryClient = useQueryClient();
  return useMutation(async (params) => {
    const {
      web3,
      account,
      userId,
      cartData,
      total,
      totalUSD,
      isAuction = false,
      auction_id,
    } = params;

    if (total.lte(0)) {
      throw "Total cost can not be zero";
    }

    // get network name
    const networkId = await web3?.eth?.net?.getId();

    if (
      process.env.GATSBY_NETWORKS == "production" &&
      (!networkId || networkId.toString() !== "1")
    ) {
      throw "Your Metamask wallet is configured for the wrong network. Please select Ethereum Mainnet and try again.";
    }

    if (
      process.env.GATSBY_NETWORKS == "test" &&
      (!networkId || networkId.toString() !== "3")
    ) {
      throw "Your Metamask wallet is configured for the wrong network. Please select Ropsten and try again.";
    }

    let ethBalance = await web3.eth.getBalance(account);

    const totalBalance = new BigNumber(total).times(new BigNumber(10).pow(18));
    ethBalance = new BigNumber(ethBalance);

    if (totalBalance.gt(ethBalance)) {
      throw "Insufficient funds in account.";
    }

    const items = [];
    const amounts = [];
    let edition_id = "";
    let item_id = "";
    let payoutWallet = "";

    for (const index in cartData) {
      items.push(cartData[index].edition_id.toString());
      amounts.push(1);
      if (isAuction) {
        edition_id = cartData[index].edition_id;
        item_id = cartData[index].item_id;
        payoutWallet = cartData[index].address;
      }
    }

    await fetch(`${process.env.GATSBY_API_URL}/purchase/validate-editions`, {
      method: "POST",
      headers: {
        Authorization: JwtAuth.getToken(),
        "Content-Type": "application/json",
      },
      body: isAuction
        ? JSON.stringify([edition_id, item_id, auction_id, "is_auction"])
        : JSON.stringify([...items]),
    })
      .then((res) => res.json())
      .then(async (data) => {
        if (data.status === "error") {
          const sold_out = data.message?.find?.((e) => e.sold_out);
          if (sold_out) {
            queryClient.refetchQueries(["all-items"]);
            throw "Some editions are not available!";
          } else {
            throw data.message;
          }
        }
        if (data.status === "success") {
          const checkoutContract = contractCheckoutManager(web3);
          const orderId = `m-${uuidv4()}`;

          const prices = await getGasPrice();

          if (isAuction) {
            const gasLimit = await checkoutContract.instance.methods
              .buyAuctionItem(
                orderId,
                userId,
                edition_id,
                item_id,
                payoutWallet || CHECKOUT_MANAGER_ADDRESS
              )
              .estimateGas({
                from: account,
                value: web3.utils.toWei(total.toFixed(18), "ether"),
              });

            queryClient.setQueriesData("metamask-warning", true);

            checkoutContract.instance.methods
              .buyAuctionItem(
                orderId,
                userId,
                edition_id,
                item_id,
                payoutWallet || CHECKOUT_MANAGER_ADDRESS
              )
              .send({
                from: account,
                value: web3.utils.toWei(total.toFixed(18), "ether"),
                gasPrice: web3.utils.toWei(prices.medium.toString(), "gwei"),
                gas: getGasFee(gasLimit),
              })
              .on("error", (error) => {
                queryClient.setQueriesData("metamask-warning", false);
              })
              .on("transactionHash", (hash) => {
                return fetch(
                  `${process.env.GATSBY_API_URL}/purchase/metamask`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: JwtAuth.getToken(),
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      orderId,
                      total: total.toFixed(18),
                      totalUSD,
                      hash,
                      ids: isAuction ? [auction_id] : items,
                      oracle: oracle.data.price,
                      isAuction,
                    }),
                  }
                )
                  .then((res) => res.json())
                  .then((data) => {
                    queryClient.setQueriesData("metamask-warning", false);
                    if (data.succeed && data.purchase_id) {
                      navigate(`/marketplace/success/${data.purchase_id}`);
                    } else {
                      throw "Your transaction failed.";
                    }
                  });
              });
          } else {
            const gasLimit = await checkoutContract.instance.methods
              .buyItems(orderId, userId, items, amounts)
              .estimateGas({
                from: account,
                value: web3.utils.toWei(total.toFixed(18), "ether"),
              });
            queryClient.setQueriesData("metamask-warning", true);
            checkoutContract.instance.methods
              .buyItems(orderId, userId, items, amounts)
              .send({
                from: account,
                value: web3.utils.toWei(total.toFixed(18), "ether"),
                gasPrice: web3.utils.toWei(prices.medium.toString(), "gwei"),
                gas: getGasFee(gasLimit),
              })
              .on("error", (error) => {
                queryClient.setQueriesData("metamask-warning", false);
              })
              .on("transactionHash", (hash) => {
                return fetch(
                  `${process.env.GATSBY_API_URL}/purchase/metamask`,
                  {
                    method: "POST",
                    headers: {
                      Authorization: JwtAuth.getToken(),
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      orderId,
                      total: total.toFixed(18),
                      totalUSD,
                      hash,
                      ids: isAuction ? [auction_id] : items,
                      oracle: oracle.data.price,
                      isAuction,
                    }),
                  }
                )
                  .then((res) => res.json())
                  .then((data) => {
                    queryClient.setQueriesData("metamask-warning", false);
                    if (data.succeed && data.purchase_id) {
                      navigate(`/marketplace/success/${data.purchase_id}`);
                    } else {
                      if (isAuction) {
                        queryClient.refetchQueries(["auctions"]);
                      }
                      throw "Your transaction failed.";
                    }
                  });
              });
          }
        } else {
          throw "Sorry, Your order can not be done";
        }
      });
  });
}
