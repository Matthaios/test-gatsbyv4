import { useEffect } from "react";
import { useQuery } from "react-query";

const defaultRequestOptions = (token) => ({
  redirect: "follow",
  headers: {
    Authorization: token,
    "Content-Type": "application/json",
  },
});

export function useOracle() {
  const query = useQuery(["oracle"], () => {
    return fetch(`${process.env.GATSBY_API_URL}/item/get-price-oracle`, {
      method: "POST",
      body: JSON.stringify({
        pair_left: "eth",
        pair_right: "usd",
      }),

      ...defaultRequestOptions(undefined),
    }).then(ResolveApiResponse);
  });

  return query;
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
