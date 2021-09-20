import JwtAuth from "@utils/JwtAuth";
import useNotification from "@utils/notifications";
import { useOracle } from "@api/useOracle";

import BigNumber from "bignumber.js";

import { useMutation, useQuery, useQueryClient } from "react-query";
import { useToken } from "./useAuth";
import { navigate } from "gatsby";
import { useSubscribeToAuctionAbly } from "./useProfile";
const API = process.env.GATSBY_API_URL;

const defaultRequestOptions = (token) => ({
  redirect: "follow",
  headers: {
    Authorization: token,
    "Content-Type": "application/json",
  },
});

export function useListAuctions(id, select) {
  const tokenQuery = useToken();

  return useQuery(
    ["edition-auctions", id],
    () => {
      return fetch(`${API}/item/get-all-auction/${id}`, {
        ...defaultRequestOptions(JwtAuth.getToken()),
      }).then(ResolveApiResponse);
    },
    { enabled: Boolean(tokenQuery?.data?.token), select }
  );
}

export function useAuction(id, prefetch = true) {
  const tokenQuery = useToken();
  return useQuery(
    ["auction", id],
    () => {
      return fetch(
        `${API}/item/get-auction/${id}`,

        {
          ...defaultRequestOptions(JwtAuth.getToken()),
        }
      ).then(ResolveApiResponse);
    },
    {
      enabled: Boolean(tokenQuery?.data?.token) && prefetch,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
}
export function useAuctionBids(id, prefetch = true) {
  const tokenQuery = useToken();

  return useQuery(
    ["auction-bids", id],
    () => {
      return fetch(`${API}/item/get-all-bid/${id}`, {
        ...defaultRequestOptions(tokenQuery?.data?.token),
      })
        .then(ResolveApiResponse)

        .catch((error) => {
          throw Error(error.message);
        });
    },
    {
      enabled: Boolean(tokenQuery?.data?.token) && prefetch,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
    }
  );
}

export function useSubmitBidOnAuction() {
  const queryClient = useQueryClient();
  const tokenQuery = useToken();
  const notify = useNotification();
  const { subscribe } = useSubscribeToAuctionAbly();
  const oracle = useOracle();
  return useMutation(
    async (data) => {
      const { web3, address: account } = data;
      const total = new BigNumber(data.bid_price);
      if (total.lt(0)) {
        throw "Bid price can not be less than zero";
      }
      const networks = {
        test: {
          ethereum: {
            value: "3",

            message:
              "Your Metamask wallet is configured for the wrong network. Please select Ropsten and try again.",
          },
        },
        production: {
          ethereum: {
            value: "1",
            message:
              "Your Metamask wallet is configured for the wrong network. Please select Ethereum Mainnet and try again.",
          },
        },
      };

      // get network name
      const networkId = await web3?.eth?.net?.getId();
      if (
        !networkId ||
        networks?.[process.env.GATSBY_NETWORKS]?.ethereum.value !=
          String(networkId)
      ) {
        throw networks?.[process.env.GATSBY_NETWORKS]?.ethereum.message;
      }

      let ethBalance = await web3.eth.getBalance(account);

      const totalBalance = total
        .dividedBy(new BigNumber(oracle?.data?.price))
        .times(new BigNumber(10).pow(18));
      ethBalance = new BigNumber(ethBalance);

      if (totalBalance.gt(ethBalance)) {
        throw "Insufficient funds in account.";
      }
      delete data.web3;
      delete data.address;

      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        ...defaultRequestOptions(tokenQuery?.data?.token),
      };
      const res = await fetch(`${API}/item/bid-auction`, requestOptions);

      if (res.ok) {
        return res.json();
      } else {
        const error = await res.json();
        throw error;
      }
    },
    {
      onSuccess: async (newData) => {
        if (newData) {
          subscribe({ id: newData.auction_id });
          await queryClient.refetchQueries([
            "edition-auctions",
            parseInt(newData.edition_id),
          ]);
          await queryClient.refetchQueries([
            "auction-bids",
            newData.auction_id,
          ]);
          navigate(`/marketplace/auction/${newData.auction_id}`);
        }
      },
    }
  );
}

export function useStartAuction(address) {
  const tokenQuery = useToken();
  const queryClient = useQueryClient();

  return useMutation(
    async (data) => {
      var requestOptions = {
        method: "POST",
        body: JSON.stringify({ address, ...data }),
        ...defaultRequestOptions(tokenQuery?.data?.token),
      };

      const res = await fetch(`${API}/item/add-auction`, requestOptions);
      if (res.ok) {
        return res.json();
      } else {
        const error = await res.json();
        console.log(error);
        throw error;
      }
    },
    {
      onSuccess: (newData) => {
        queryClient.refetchQueries([
          "edition-auctions",
          parseInt(newData.edition_id),
        ]);
        queryClient.refetchQueries("auctions");
        navigate(`/marketplace/auction/${newData.id}`);
      },
    }
  );
}
export function useModifyAuction() {
  const tokenQuery = useToken();
  const queryClient = useQueryClient();
  return useMutation(
    (data) => {
      var requestOptions = {
        method: "POST",
        body: JSON.stringify(data),
        ...defaultRequestOptions(tokenQuery?.data?.token),
      };

      return fetch(`${API}/item/update-auction`, requestOptions)
        .then(ResolveApiResponse)
        .catch((error) => {
          throw error;
        });
    },
    {
      onSuccess: (data) => {
        queryClient.refetchQueries(["auctions"]);
        queryClient.refetchQueries(["auction", data.id]);
      },
    }
  );
}

async function ResolveApiResponse(response) {
  if (!response.ok) {
    if (response.status === 401) {
      throw Error("You need to login first");
    } else {
      const error = await response.json();
      console.log("error", error);
      throw Error(error);
    }
  }
  return response.json();
}
