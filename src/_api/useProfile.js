import React from "react";
import JwtAuth from "@utils/JwtAuth";
import useNotification from "@utils/notifications";
import { Link } from "gatsby";
import { navigate } from "gatsby-link";
import get from "lodash/get";

import { useEffect } from "react";
import { QueryCache, useMutation, useQuery, useQueryClient } from "react-query";
import { v4 as uuid } from "uuid";
import { useToken } from "./useAuth";
import useAllEditions from "./useItems";
export function usePurchases(select) {
  const { data: tokenData } = useToken();
  const { editions } = useAllEditions();
  const query = useQuery(
    "purchases",
    async () => {
      return fetch(
        `${process.env.GATSBY_API_URL}/user/get-purchases/${tokenData?.userId}`,
        {
          headers: {
            Authorization: tokenData?.token,
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          res.purchases = res.purchases.map((p) => {
            return {
              ...p,
              minted: editions.find((e) => e.edition_id == p.edition_id)
                ?.total_minted,
            };
          });
          return res;
        });
    },
    {
      select: select,
      enabled: Boolean(tokenData?.token),
    }
  );

  return {
    ...query,
    purchases: query?.data?.purchases,
    eligibility: query?.data?.eligibility,
  };
}

export function useAuctions(select) {
  const { data: tokenData } = useToken();
  const { subscribe } = useSubscribeToAuctionAbly();
  const query = useQuery(
    "auctions",
    async () => {
      return fetch(
        `${process.env.GATSBY_API_URL}/user/get-auctions/${tokenData?.userId}`,
        {
          headers: {
            Authorization: tokenData?.token,
          },
        }
      ).then((res) => res.json());
    },
    {
      select: select,
      enabled: Boolean(tokenData?.token),
      onSuccess: (data) => {
        data?.auctions
          ?.filter((auction) => !auction?.completed || auction?.succeed)
          ?.forEach(subscribe);
        data?.bids
          ?.filter((bid) => !bid.completed)
          ?.map((bid) => {
            return { ...bid, id: bid.auction_id };
          })
          ?.forEach(subscribe);
      },
    }
  );

  return {
    ...query,
    auctions: query?.data?.auctions,
    bids: query?.data?.bids,
  };
}

export function useSubscribeToAuctionAbly() {
  const queryClient = useQueryClient();

  const notification = useNotification();
  if (typeof window == "undefined") {
    return () => {};
  }

  function subscribe({ id }) {
    const client = window?.__ably;
    const connectedChannels = client?.connection?.ably?.channels?.all
      ? Object.keys(client?.connection?.ably?.channels?.all)
      : [];
    if (!client || connectedChannels.includes(`auction:${id}`)) {
      console.log("auction already subscribed");
      return;
    } else {
      const channel = client.channels.get(`auction:${id}`);
      console.log(`subscribed to auction:${id}`);
      channel.subscribe((message) => {
        console.log(`auction:${id}`, message.name, message);
        switch (message.name) {
          case "auction-update":
            queryClient.invalidateQueries(["auction-bids", String(id)]);
            queryClient.invalidateQueries(["auction", String(id)]);

            break;
          case "auction-end":
            queryClient.invalidateQueries(["auction-bids", String(id)]);
            queryClient.invalidateQueries(["auction", String(id)]);
            queryClient.invalidateQueries(["auctions"]);
            queryClient.invalidateQueries(["orders"]);
            queryClient.invalidateQueries(["purchases"]);
            if (window?.location?.pathname != `/marketplace/auction/${id}`) {
              notification.info({
                text: (
                  <div>
                    <h2>Auction "{id}" had an update.</h2>
                    <p>
                      <Link to={`/marketplace/auction/${id}`}>
                        Click to see details
                      </Link>
                    </p>
                  </div>
                ),
              });
            }
          case "payment":
            queryClient.invalidateQueries(["auction-bids", String(id)]);
            queryClient.invalidateQueries(["auction", String(id)]);
            queryClient.invalidateQueries(["orders"]);
            queryClient.invalidateQueries(["purchases"]);

            if (window?.location?.pathname != `/marketplace/auction/${id}`) {
              notification.info({
                text: (
                  <div>
                    <h2>Auction "{id}" had an update.</h2>
                    <p>
                      <Link to={`/marketplace/auction/${id}`}>
                        Click to see details
                      </Link>
                    </p>
                  </div>
                ),
              });
            }
            break;
          default:
            break;
        }
      });
    }
  }
  function unsubscribe({ id }) {
    const client = window?.__ably;
    const connectedChannels = client?.connection?.ably?.channels?.all
      ? Object.keys(client?.connection?.ably?.channels?.all)
      : [];
    if (!client || !connectedChannels.includes(`auction:${id}`)) {
      return;
    } else {
      const channel = client.channels.get(`auction:${id}`);
      channel.unsubscribe();
      return;
    }
  }
  return { subscribe, unsubscribe };
}
