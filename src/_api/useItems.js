import { graphql, useStaticQuery, navigate } from "gatsby";
import { useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import omit from "lodash/omit";

import BigNumber from "bignumber.js";

import JwtAuth from "@utils/JwtAuth";
import useNotification from "@utils/notifications";

import {
  contractTransferManager,
  getGasPrice,
  getGasFee,
} from "@contracts/index";
import hideAuctionItems from "@utils/hideAuctionItems";

export default function useAllEditions(select) {
  let { allEdition } = useStaticQuery(graphql`
    query {
      allEdition {
        nodes {
          ...Edition
        }
      }
    }
    fragment Edition on Edition {
      assets {
        url
      }
      media {
        type
        url
        file {
          id
          url

          sharp: childImageSharp {
            gatsbyImageData
          }
        }
      }

      show_store_buttons
      locked_message
      thumbnail {
        sharp: childImageSharp {
          gatsbyImageData(width: 500, height: 500)
        }
      }
      hero: media {
        type
        url
        file {
          id
          url
          sharp: childImageSharp {
            gatsbyImageData(width: 1500, height: 700)
          }
        }
      }
      thumbnail_cart: thumbnail {
        sharp: childImageSharp {
          gatsbyImageData(width: 80, height: 80)
        }
      }

      total_minted
      is_locked
      token_price
      publishing_status
      publisher_name
      belongsToSets {
        id
      }
      id
      slug: gatsbyPath(filePath: "/marketplace/item/{Edition.edition_name}")
      edition_name
      edition_id
      description
      sold_out
      app_name
      network
      distribution_start(formatString: "ll")
    }
  `);
  const initialData = allEdition.nodes;

  const query = useQuery(
    "all-items",
    async () => {
      return fetch(`${process.env.GATSBY_API_URL}/item/get-all-items`)
        .then((res) => res.json())
        .then((res) => {
          return allEdition.nodes.map((prefetchedItem) => {
            var item = res.find(
              (i) => i.edition_id == prefetchedItem.edition_id
            );

            return Object.assign(
              {},
              prefetchedItem,
              {
                lowest_ask: item.lowest_auction
                  ? parseFloat(item.lowest_auction) <
                    parseFloat(item.token_price)
                    ? item.lowest_auction
                    : item.token_price
                  : item.token_price,
              },
              omit(item, ["distribution_start"])
            );
          });
        });
    },
    {
      select,
      initialData: initialData.map((item) => {
        return {
          ...item,
          lowest_ask: item.lowest_auction
            ? parseFloat(item.lowest_auction) < parseFloat(item.token_price)
              ? item.lowest_auction
              : item.token_price
            : item.token_price,
        };
      }),
    }
  );
  useEffect(() => {
    if (!query.isFetched) {
      query.refetch();
    }
  }, []);
  return { ...query, editions: query.data };
}

export function useEdition(edition_id) {
  const query = useAllEditions((data) =>
    data.find((item) => item.edition_id == edition_id)
  );
  return {
    ...query,
    item: query.data,
    edition: query.data,
  };
}

export function useCollection(collection) {
  const query = useAllEditions((data) =>
    data.filter((item) => {
      if (collection) {
        return item.collection == collection;
      }
      return false;
    })
  );
  return {
    ...query,
    collection: query.data,
  };
}
export function useCollections() {
  const query = useAllEditions((data) =>
    data.filter((item) => {
      return !!item.collection;
    })
  );
  const collections = new Set();
  query?.data?.forEach((item) => {
    if (item.collection) {
      collections.add(item.collection);
    }
  });
  return {
    ...query,
    collections: Array.from(collections),
  };
}

export function useMarketplaceItems() {
  const query = useAllEditions((data) => {
    return data
      .filter(hideAuctionItems)
      .filter((item) => {
        return !item.is_redemption;
      })
      .filter((item) => {
        return item.belongsToSets.length === 0;
      });
  });
  return {
    ...query,
    items: query.data,
  };
}

const networks = {
  test: {
    heco: {
      value: "256",
      min: 10000000000000000,
      minText: "0.01HT",
      message:
        "Your Metamask wallet is configured for the wrong network. Please select HECO TEST NETWORK and try again.",
    },
    ethereum: {
      value: "3",
      min: 20000000000000000,
      minText: "0.02ETH",
      message:
        "Your Metamask wallet is configured for the wrong network. Please select Ropsten and try again.",
    },
  },
  production: {
    heco: {
      value: "128",
      min: 10000000000000000,
      minText: "0.01HT",
      message:
        "Your Metamask wallet is configured for the wrong network. Please select Heco and try again.",
    },
    ethereum: {
      value: "1",
      min: 20000000000000000,
      minText: "0.02ETH",
      message:
        "Your Metamask wallet is configured for the wrong network. Please select Ethereum Mainnet and try again.",
    },
  },
};

export function useTransferItem() {
  const notify = useNotification();
  const queryClient = useQueryClient();
  return useMutation(async (params) => {
    const { web3, sender, receiver, itemId, editionId, network } = params;
    // get network name
    const networkId = await web3?.eth?.net?.getId();

    if (
      !networkId ||
      networkId.toString() !==
        networks?.[process.env.GATSBY_NETWORKS]?.[network].value
    ) {
      throw networks?.[process.env.GATSBY_NETWORKS]?.[network].message;
    }

    let balance = await web3.eth.getBalance(sender);
    if (balance < networks?.[process.env.GATSBY_NETWORKS]?.[network].min) {
      throw `You need to have at least ${
        networks?.[process.env.GATSBY_NETWORKS]?.[network].minText
      } to start the transfer!`;
    }

    try {
      const requestParams = {
        receiver,
        sender,
        item_id: itemId,
        edition_id: editionId,
        network: String(network).toUpperCase(),
      };

      await fetch(`${process.env.GATSBY_API_URL}/item/requestwithdraw`, {
        method: "POST",
        headers: {
          Authorization: JwtAuth.getToken(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestParams),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (data && "contract" in data && "signature" in data) {
            const contractAddress = data.contract;
            const signature = data.signature;
            const transferManagerContract = contractTransferManager(
              web3,
              contractAddress
            );

            // const transferFee = 0;
            const transferFee = await transferManagerContract.instance.methods
              .getTransferFee()
              .call();

            // const result = await transferManagerContract.instance.methods
            //   .verify(signature.sender, signature.receiver, signature.user_id, new BigNumber(signature.tokenId), new BigNumber(signature.nonce), signature.signature)
            //   .call();
            // console.log('verify result', result);

            const prices = await getGasPrice();

            const gasLimit = await transferManagerContract.instance.methods
              .transferItem(
                signature.receiver,
                signature.user_id,
                new BigNumber(`${signature.tokenId}`),
                new BigNumber(`${signature.nonce}`),
                signature.signature
              )
              .estimateGas({
                from: signature.receiver,
                value: web3.utils.toWei("0", "ether"),
              });

            const transferResult =
              await transferManagerContract.instance.methods
                .transferItem(
                  signature.receiver,
                  signature.user_id,
                  new BigNumber(`${signature.tokenId}`),
                  new BigNumber(`${signature.nonce}`),
                  signature.signature
                )
                .send({
                  from: signature.receiver,
                  value: web3.utils.toWei(transferFee.toString(), "ether"),
                  gasPrice: web3.utils.toWei(prices.medium.toString(), "gwei"),
                  gas: getGasFee(gasLimit),
                })
                .on("transactionHash", (hash) => {
                  queryClient.refetchQueries("purchases");
                  queryClient.refetchQueries("transfers");
                  navigate(`/marketplace/transfer/${editionId}/${itemId}`);
                });

            if (transferResult.status) {
            } else {
              notify.error({ text: "Your transaction has been Failed" });
            }
          } else {
            notify.error({ text: "Sorry, Your request can not be done" });
          }
        });
    } catch (error) {
      console.log(error.message);
      notify.error({ text: error.message });
    }
  });
}
