import { useQuery, useQueryClient } from "react-query";
import isFunction from "lodash/isFunction";
import useAuth from "./useAuth";
import Ably from "ably/promises";
import React, { createContext, useContext, useEffect, useState } from "react";
import useNotification from "@utils/notifications";
import { Link, navigate } from "gatsby";

const AblyContext = createContext();

export default function AblyProvider({ children }) {
  const { user, ...auth } = useAuth();
  const clientId = user?.id;
  const [ably, setAbly] = useState(null);
  const queryClient = useQueryClient();
  const notification = useNotification();
  useEffect(() => {
    if (typeof window == "undefined") {
      return;
    }
    if (clientId) {
      const client = new Ably.Realtime.Promise({
        authUrl: "/.netlify/functions/ably-auth",

        echoMessages: false,
      });

      const userChannel = client.channels.get(`user:${user?.user_id}`);

      userChannel.subscribe((message) => {
        console.log(`user:${user?.user_id}`, message.name, message);
        switch (message.name) {
          case "payment_history": {
            const data =
              typeof message?.data === "string"
                ? JSON.parse(message?.data)
                : message?.data;

            typeof window !== "undefined" &&
              !window.location.pathname.startsWith("/marketplace/success") &&
              PaymentHistoryResolver(data, queryClient);
            queryClient.invalidateQueries(["orders", data.purchase_id]);

            if (data.status === "purchased") {
              queryClient.invalidateQueries(["purchases"]);
              queryClient.invalidateQueries(["auctions"]);
            }
            queryClient.invalidateQueries(["transfers"]);
            break;
          }
          case "transfered_out_item": {
            const data =
              typeof message?.data === "string"
                ? JSON.parse(message?.data)
                : message?.data;
            typeof window !== "undefined" &&
              !window.location.pathname.startsWith("/marketplace/transfer") &&
              PaymentHistoryResolver(data, queryClient);
            queryClient.invalidateQueries(["purchases"]);
            queryClient.invalidateQueries(["transfers"]);
            queryClient.invalidateQueries(["transfer"]);
            break;
          }
          default:
            console.log(
              JSON.stringify({ name: message.name, data: message.data })
            );
            break;
        }
      });

      window.__ably = client;
      client.connection.on((e) => {
        console.log(e);
      });
      setAbly(client);
    }
  }, [clientId]);

  return <AblyContext.Provider value={ably}>{children}</AblyContext.Provider>;
}

function PaymentHistoryResolver(data, queryClient) {
  const notification = useNotification();
  data.platform === "auction"
    ? (async () => {
        if (data.status === "succeed") {
          await queryClient.invalidateQueries(["auction", data.auction_id]);
        } else {
        }
      })()
    : notification.blank(
        {
          id: data.purchase_id,
          text: [
            <div className="text-lg">
              <p className="mb-2">Your latest order has been updated!</p>
              <p>
                <Link
                  onClick={() => {
                    notification.clear(data.purchase_id);
                  }}
                  className="button"
                  to={`/marketplace/success/${data.purchase_id}`}
                >
                  Check your order
                </Link>
              </p>
            </div>,
          ],
          styles: "text-primary",
          containerStyles: "!w-96",
        },
        12
      );
}

function TransferHistoryResolver(data) {
  const notification = useNotification();
  const transferId = `${data.edition_id}-${data.item_id}`;

  notification.blank(
    {
      id: transferId,
      text: [
        <div className="text-lg">
          <p className="mb-2">Your latest transfer has been updated!</p>
          <p>
            <Link
              onClick={() => {
                notification.clear(transferId);
              }}
              className="button"
              to={`/marketplace/transfer/${transferId}`}
            >
              Check your transfer
            </Link>
          </p>
        </div>,
      ],
      styles: "text-primary",
      containerStyles: "!w-96",
    },
    12
  );
}

AblyProvider.displayName = "AblyProvider";
export const useAbly = () => {
  return useContext(AblyContext);
};
