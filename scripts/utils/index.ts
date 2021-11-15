import { createWeb3ApiClient, Web3ApiClient } from "@web3api/client-js";
import { graphNodePlugin } from "@web3api/graph-node-plugin-js";
import { ConnectionConfigs, ethereumPlugin } from "@web3api/ethereum-plugin-js";
import { loggerPlugin } from "@web3api/logger-plugin-js";
import { httpPlugin } from "@web3api/http-plugin-js";
import { dateTimePlugin } from "date-time-plugin";
import { ethers } from "ethers";
import { JsonRpcProvider } from "@web3api/client-js/build/pluginConfigs/Ethereum";
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
      : chain == "matic"
      ? `https://polygon-mainnet.g.alchemy.com/v2/${ALCHEMY_ID}`
      : chain == "fantom"
      ? "https://rpcapi.fantom.network/"
      : "";

  return new ethers.providers.JsonRpcProvider(rpc);
};

export const getWeb3ApiClient = async (
  chain: string,
  env: "local" | "prod"
): Promise<Web3ApiClient> => {
  const provider: JsonRpcProvider = getProvider(chain);
  const environment = env == "local" ? "testnet" : chain;

  const networkConfig: ConnectionConfigs = { [environment]: { provider } };

  const client = await createWeb3ApiClient(
    {},
    {
      plugins: [
        {
          uri: "ens/datetime.eth",
          plugin: dateTimePlugin({}),
        },
        {
          uri: "w3://ens/ethereum.web3api.eth",
          plugin: ethereumPlugin({
            networks: networkConfig,
            defaultNetwork: environment,
          }),
        },
        {
          uri: "w3://ens/graph-node.web3api.eth",
          plugin: graphNodePlugin({ provider: "https://api.thegraph.com" }),
        },
        {
          uri: "w3://ens/js-logger.web3api.eth",
          plugin: loggerPlugin(),
        },
        {
          uri: "w3://ens/http.web3api.eth",
          plugin: httpPlugin(),
        },
      ],
    }
  );

  return client;
};
