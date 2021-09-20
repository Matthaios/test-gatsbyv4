import React from "react";
const networks = {
  test: {
    heco: {
      value: "256",
      name: "HECO TEST NETWORK",
    },
    ethereum: {
      value: "3",
      name: "Ropsten",
    },
  },
  production: {
    heco: {
      value: "128",
      name: "Heco",
    },
    ethereum: {
      value: "1",
      name: "Ethereum Mainnet",
    },
  },
};
export default function formatNetwork(network) {
  return networks?.[process.env.GATSBY_NETWORKS]?.[network].name;
}
