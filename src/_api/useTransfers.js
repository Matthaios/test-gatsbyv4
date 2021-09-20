import get from "lodash/get";
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

export function useTransfers(select = (a) => a) {
  const { user } = useAuth();
  const tq = useToken();
  return useQuery(
    ["transfers"],
    () => {
      return fetch(`${process.env.GATSBY_API_URL}/user/transfer-history`, {
        method: "GET",
        ...defaultRequestOptions(tq?.data?.token),
      })
        .then(ResolveApiResponse)
        .then((res) => {
          return res;
        });
    },
    { select, enabled: Boolean(user?.user_id) }
  );
}

export function useTransferDetails(edition_id, item_id) {
  const { user } = useAuth();
  const tq = useToken();
  return useQuery(
    ["transfer", [edition_id, item_id]],
    () => {
      return fetch(
        `${process.env.GATSBY_API_URL}/user/transfer-history/${edition_id}/${item_id}`,
        {
          method: "GET",
          ...defaultRequestOptions(tq?.data?.token),
        }
      )
        .then(ResolveApiResponse)
        .then((res) => {
          return res;
        });
    },
    { enabled: Boolean(user?.user_id) }
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
