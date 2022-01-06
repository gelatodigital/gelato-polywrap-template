import {
  Ethereum_Connection,
  Ethereum_Query,
  Gelato_CheckerResult,
  GelatoPlugin_Query,
  GraphNode_Query,
  Http_Query,
  Input_checker,
  Logger_Logger_LogLevel,
  Logger_Query,
  UserConfig,
} from "./w3";

export function checker(input: Input_checker): Gelato_CheckerResult {
  // Deserialize arguments you have passed
  const config = UserConfig.fromBuffer(input.argBuffer);
  const counterAddress = config.counterAddress;
  const encryptedString = config.encodedApi;

  // Gas price, decryption key and eth provider is passed by Gelato by default
  const connection = input.connection;
  const decryptKey = input.decryptKey;
  const gasPrice = input.gasPrice;

  let ethConnection: Ethereum_Connection | null = null;
  if (connection) {
    ethConnection = {
      node: connection.node,
      networkNameOrChainId: connection.networkNameOrChainId,
    };
  }

  // Decrypt message/string passed as argument
  const api = GelatoPlugin_Query.decrypt({ decryptKey, encryptedString });

  // Subgraph query
  const subgraphReq = GraphNode_Query.querySubgraph({
    subgraphAuthor: "gelatodigital",
    subgraphName: "poke-me-polygon",
    query: `{
      tasks(first: 1){
        id
      }
    }
    `,
  });

  // Reading on-chain data
  const lastExecuted = Ethereum_Query.callContractView({
    address: counterAddress,
    method: "function lastExecuted() view returns (uint256)",
    args: null,
    connection: ethConnection,
  });

  // Getting epoch unix timestamp in seconds
  const timeNow = GelatoPlugin_Query.timeNowInSeconds({}).toInt32();
  const THREE_MINUTES = 3 * 60;
  const nextExecutionTime = parseInt(lastExecuted) + THREE_MINUTES;

  log(`Counter Address: ${counterAddress}`);
  log(`Gas Price: ${gasPrice}`);
  log(`Api decrypted: ${api}`);
  log(`Subgraph Req: ${subgraphReq}`);
  log(`Last Execution Time: ${lastExecuted}`);
  log(`Time now: ${timeNow}`);
  log(`Next Execution Time: ${nextExecutionTime}`);

  const canExec = timeNow >= nextExecutionTime;

  // Build payload
  const execPayload = Ethereum_Query.encodeFunction({
    method: "function increaseCount(uint256)",
    args: ["1000"],
  });

  const resolverData: Gelato_CheckerResult = {
    canExec: canExec,
    execPayload: execPayload,
  };

  return resolverData;
}

function log(msg: string): void {
  Logger_Query.log({
    message: msg,
    level: Logger_Logger_LogLevel.INFO,
  });
}
