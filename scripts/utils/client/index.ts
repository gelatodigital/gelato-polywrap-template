import {
  createWeb3ApiClient,
  PluginConfigs,
  Web3ApiClient,
} from "@web3api/client-js";
import { JsonRpcProvider } from "@web3api/client-js/build/pluginConfigs/Ethereum";
import { ConnectionConfigs, ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { ethers } from "ethers";
import { gelatoPlugin } from "gelato-polywrap-plugin";

import dotenv from "dotenv";

const config = dotenv.config().parsed;
const ALCHEMY_ID = config && config.ALCHEMY_ID;

const getProvider = (chain: string) => {
  const rpc =
    chain == "mainnet"
      ? `https://eth-mainnet.alchemyapi.io/v2/${ALCHEMY_ID}`
      : chain == "ropsten"
      ? `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_ID}`
      : chain == "rinkeby"
      ? `https://eth-rinkeby.alchemyapi.io/v2/${ALCHEMY_ID}`
      : chain == "goerli"
      ? `https://eth-goerli.alchemyapi.io/v2/${ALCHEMY_ID}`
      : chain == "kovan"
      ? `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_ID}`
      : chain == "arbitrum"
      ? `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`
      : chain == "avalanche"
      ? `https://api.avax.network/ext/bc/C/rpc`
      : chain == "bsc"
      ? "https://bsc-dataseed.binance.org/"
      : chain == "fantom"
      ? "https://rpcapi.fantom.network/"
      : chain == "matic"
      ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`
      : "";

  return new ethers.providers.JsonRpcProvider(rpc);
};

export const getWeb3ApiClient = async (
  chain: string,
  env: "local" | "prod",
  ipfsProvider?: string
): Promise<Web3ApiClient> => {
  const environment = env == "local" ? "testnet" : chain;
  const provider: JsonRpcProvider = getProvider(chain);

  let networkConfig: ConnectionConfigs =
    env == "local" ? { testnet: { provider } } : { [chain]: { provider } };

  const configs: PluginConfigs = ipfsProvider
    ? { ipfs: { provider: ipfsProvider } }
    : {};

  const client = await createWeb3ApiClient(configs, {
    plugins: [
      {
        uri: "ens/gelato-plugin.eth",
        plugin: gelatoPlugin({}),
      },
      {
        uri: "w3://ens/ethereum.web3api.eth",
        plugin: ethereumPlugin({
          networks: networkConfig,
          defaultNetwork: environment,
        }),
      },
    ],
  });

  return client;
};
