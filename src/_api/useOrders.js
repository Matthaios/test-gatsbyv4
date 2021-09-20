import get from "lodash/get";
import { useRef } from "react";
import { useQuery, useQueryClient } from "react-query";
import useAuth, { useToken } from "./useAuth";
import useAllEditions from "./useItems";

const defaultRequestOptions = (token) => ({
  redirect: "follow",
  headers: {
    Authorization: token,
    "Content-Type": "application/json",
  },
});

export function useOrder(purchaseId) {
  const { user } = useAuth();
  const { data: items } = useAllEditions();
  const tq = useToken();
  const retries = useRef(0);
  const query = useQuery(
    ["orders", purchaseId],
    () => {
      return fetch(`${process.env.GATSBY_API_URL}/purchase/get-order-details`, {
        method: "POST",
        body: JSON.stringify({
          purchaseId,
        }),
        ...defaultRequestOptions(tq?.data?.token),
      })
        .then(ResolveApiResponse)
        .then((res) => {
          return res.map((p) => {
            return {
              ...p,
              item: items.find((item) => item.edition_id === p.editionId),
            };
          });
        });
    },
    {
      onSuccess: (data) => {
        if (data?.length == 0 && retries.current < 6) {
          retries.current = retries.current + 1;
          setTimeout(() => {
            query.refetch();
          }, 1000);
        }
      },
      enabled: Boolean(user?.user_id),
    }
  );

  return query;
}

export function useOrders() {
  const { user } = useAuth();
  const { data: items } = useAllEditions();
  const tq = useToken();
  return useQuery(
    ["orders"],
    () => {
      return fetch(
        `${process.env.GATSBY_API_URL}/purchase/get-users-purchases`,
        {
          method: "POST",
          body: JSON.stringify({
            user_id: user.user_id,
          }),
          ...defaultRequestOptions(tq?.data?.token),
        }
      )
        .then(ResolveApiResponse)
        .then((res) => {
          return Object.entries(res)
            .map((p) => {
              return {
                id: p[0],
                status: get(p, "[1][0].status"),
                purchase_date: get(p, "[1][0].purchase_date"),
                platform: get(p, "[1][0].platform"),
                amount: get(p, "[1][0].amount"),
                eth_amount: get(p, "[1][0].eth_amount"),
                items: p[1].map((item) => {
                  return Object.assign(
                    {},
                    items.find((i) => i.edition_id === item.edition_id),
                    item
                  );
                }),
              };
            })
            .sort((a, b) => {
              return new Date(b.purchase_date) - new Date(a.purchase_date);
            });
        });
    },
    {
      enabled: Boolean(user?.user_id),
    }
  );
}

async function ResolveApiResponse(response) {
  if (!response.ok) {
    if (response.status === 401) {
      throw Error("You need to login first");
    } else {
      const error = await response.json();
      console.log({ response, error });
      throw Error(error);
    }
  } else {
    return response.json();
  }
}
