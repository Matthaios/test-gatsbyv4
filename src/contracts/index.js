import axios from "axios";

import CHECKOUT_MANAGER_ABI from "./abi/checkout_manager_abi.json";
import TRANSFER_MANAGER_ABI from "./abi/transfer_manager_abi.json";

// export const DEV_CHECKMANAGER_ADDRESS =
//   "0x59550b59A45Dc923edC69026db58E1fe22E714c8";
// export const PROD_CHECKMANAGER_ADDRESS =
//   "0x59550b59A45Dc923edC69026db58E1fe22E714c8";

export const CHECKOUT_MANAGER_ADDRESS =
  process.env.GATSBY_CHECKOUT_MANAGER_ADDRESS;

export const getGasPrice = async () => {
  const response = await axios.get(
    "https://ethgasstation.info/json/ethgasAPI.json"
  );
  const prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10,
    fastest: Math.round(response.data.fastest / 10),
  };
  return prices;
};

export const contractCheckoutManager = (web3) => {
  const abi = CHECKOUT_MANAGER_ABI;
  const address = CHECKOUT_MANAGER_ADDRESS;
  const instance = new web3.eth.Contract(abi, address);

  return {
    address,
    abi,
    instance,
  };
};

export const contractTransferManager = (web3, contractAddress) => {
  const abi = TRANSFER_MANAGER_ABI;
  const address = contractAddress;
  const instance = new web3.eth.Contract(abi, address);

  return {
    address,
    abi,
    instance,
  };
};

export const GAS_PRICE_MULTIPLIER = 1.3;

export const getGasFee = (gasPrice) => {
  return Math.round(gasPrice * GAS_PRICE_MULTIPLIER);
};
