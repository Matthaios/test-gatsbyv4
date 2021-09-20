import React, { useEffect } from "react";
import { useQuery, useQueryClient } from "react-query";

const INITIAL_STATE = {};

export default function useWeb3() {
  const queryClient = useQueryClient();
  const query = useQuery(
    "web3",
    async () => {
      // Logic for connecting metamask in case user is not connected you can do whatever you want here.
      // Important part is that in the end it returns us the next connection state
    },
    {
      initialData: INITIAL_STATE,
    }
  );
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Logic for initial check if user is logged in to metamask wallet

      // you would add next connection state in this function below instead of INITIAL_STATE
      queryClient.setQueriesData("web3", INITIAL_STATE);
    }
  }, []);
  // Function that you can call when user disconnects from Metamask
  function onMetamaskDisconnect() {
    queryClient.setQueriesData("web3", null);
  }

  return {
    ...query,
    web3: query.data,
  };
}

export const isMetamaskInstalled = typeof web3 !== "undefined" ? true : false;
