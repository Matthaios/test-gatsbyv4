import { useCallback, useEffect, useState } from "react";
import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useQuery, useQueryClient } from "react-query";

import { getChainData } from "@helpers/utilities";
import { apiGetAccountAssets } from "@helpers/api";

const initWeb3 = (provider) => {
  const web3 = new Web3(provider);

  web3.eth.extend({
    methods: [
      {
        name: "chainId",
        call: "eth_chainId",
        outputFormatter: web3.utils.hexToNumber,
      },
    ],
  });

  return web3;
};

const getNetwork = (chainId) => getChainData(chainId)?.network;

const getProviderOptions = () => {
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        infuraId: process.env.GATSBY_APP_INFURA_ID,
      },
    },
  };
  return providerOptions;
};

const isMetamaskInstalled = typeof web3 !== "undefined" ? true : false;

const INITIAL_STATE = {
  isMetamaskInstalled: false,
  fetching: false,
  accounts: [],
  address: "",
  web3: null,
  provider: null,
  connected: false,
  chainId: 1,
  networkId: 1,
  assets: [],
  showModal: false,
  pendingRequest: false,
  result: null,
};

const getWalletDetails = async (web3) => {
  const accounts = await web3.eth.getAccounts();
  const address = accounts[0];
  const networkId = await web3.eth.net.getId();
  const chainId = await web3.eth.chainId();

  return {
    isMetamaskInstalled,
    address,
    networkId,
    chainId,
  };
};

const useWeb3Modal = () => {
  const queryClient = useQueryClient();

  let web3Modal;

  const [state, setState] = useState({ ...INITIAL_STATE });

  web3Modal =
    typeof window !== "undefined" &&
    new Web3Modal({
      network: getNetwork(state.chainId),
      cacheProvider: true,
      providerOptions: getProviderOptions(),
    });

  useEffect(() => {
    console.log("init");
    setState({
      ...state,
      isMetamaskInstalled,
    });
  }, []);

  useEffect(() => {
    // console.log('state changed');
    // console.log(state);
    queryClient.setQueriesData("web3", state);
  }, [state]);

  const query = useQuery(
    "web3",
    async () => {
      // Logic for connecting metamask in case user is not connected you can do whatever you want here.
      // Important part is that in the end it returns us the next connection state
    },
    {
      initialData: { ...state },
    }
  );

  const subscribeProvider = async (provider) => {
    console.log("provider", provider);
    if (!provider.on) {
      return;
    }
    provider.on("close", () => resetApp());
    provider.on("accountsChanged", async (accounts) => {
      const web3 = initWeb3(provider);
      const walletDetails = await getWalletDetails(web3);
      console.log("account changed");
      setState({
        ...state,
        connected: true,
        web3,
        provider,
        ...walletDetails,
        address: accounts[0],
      });
    });
    provider.on("chainChanged", async (chainId) => {
      const web3 = initWeb3(provider);
      const networkId = await web3?.eth?.net?.getId();
      const walletDetails = await getWalletDetails(web3);
      console.log("chain changed");
      setState({
        ...state,
        connected: true,
        web3,
        provider,
        chainId,
        networkId,
        address: walletDetails.address,
      });
    });

    provider.on("networkChanged", async (networkId) => {
      const web3 = initWeb3(provider);
      const chainId = await web3.eth.chainId();
      const walletDetails = await getWalletDetails(web3);
      console.log("network changed");
      setState({
        ...state,
        connected: true,
        web3,
        provider,
        chainId,
        networkId,
        address: walletDetails.address,
      });
    });
  };

  const resetApp = async () => {
    console.log("closed.....................................");
    const { web3 } = state;
    if (web3 && web3.currentProvider && web3.currentProvider.close) {
      await web3.currentProvider.close();
    }
    await web3Modal.clearCachedProvider();
    setState({ ...INITIAL_STATE });

    queryClient.setQueriesData("web3", null);
  };

  const getAccountAssets = async (address, chainId) => {
    try {
      // get account balances
      const assets = await apiGetAccountAssets(address, chainId);
      return assets;
    } catch (error) {
      console.error(error); // tslint:disable-line
      return null;
    }
  };

  const onConnect = async () => {
    const provider = await web3Modal.connect();

    await subscribeProvider(provider);

    const web3 = initWeb3(provider);

    const walletDetails = await getWalletDetails(web3);

    setState({
      web3,
      provider,
      connected: true,
      ...walletDetails,
    });

    return { address: walletDetails.address, web3 };
  };

  return {
    onConnect,
    getAccountAssets,
    conState: { ...state },
    query,
  };
};

export default useWeb3Modal;
