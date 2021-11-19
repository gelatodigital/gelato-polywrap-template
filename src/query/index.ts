import {
  DateTime_Query,
  Ethereum_Connection,
  Ethereum_Query,
  Gelato_CheckerResult,
  Gelato_Ethereum_Connection,
  GraphNode_Query,
  Http_Query,
  Input_checker,
  Logger_Logger_LogLevel,
  Logger_Query,
  UserConfig,
} from "./w3";

export function checker(input: Input_checker): Gelato_CheckerResult {
  const config = UserConfig.fromBuffer(input.argBuffer);
  const COUNTER = config.counterAddress;
  const connection = input.connection;
  let ethConnection: Ethereum_Connection | null = null;
  if (connection) {
    ethConnection = {
      node: connection.node,
      networkNameOrChainId: connection.networkNameOrChainId,
    };
  }

  Logger_Query.log({
    level: Logger_Logger_LogLevel.INFO,
    message: `config.counterAddress : ${config.counterAddress}`,
  });

  const lastExecuted = Ethereum_Query.callContractView({
    address: COUNTER,
    method: "function lastExecuted() view returns (uint256)",
    args: null,
    connection: ethConnection,
  });

  const count = Ethereum_Query.callContractView({
    address: COUNTER,
    method: "function count() view returns (uint256)",
    args: null,
    connection: ethConnection,
  });

  Logger_Query.log({
    level: Logger_Logger_LogLevel.INFO,
    message: `Last executed : ${lastExecuted}`,
  });

  Logger_Query.log({
    level: Logger_Logger_LogLevel.INFO,
    message: `Count : ${count}`,
  });

  const timeNow = Math.floor(
    parseInt(DateTime_Query.currentTime({}).toString()) / 1000
  );
  const THREE_MINUTES = 3 * 60;
  const nextExecutionTime = parseInt(lastExecuted) + THREE_MINUTES;

  Logger_Query.log({
    level: Logger_Logger_LogLevel.INFO,
    message: `nextExecutionTime : ${nextExecutionTime}`,
  });

  Logger_Query.log({
    level: Logger_Logger_LogLevel.INFO,
    message: `timeNow : ${timeNow}`,
  });

  const canExec = timeNow >= nextExecutionTime;

  const execPayload = Ethereum_Query.encodeFunction({
    method: "function increaseCount(uint256)",
    args: ["100"],
  });

  const resolverData: Gelato_CheckerResult = {
    canExec: canExec,
    execPayload: execPayload,
  };

  return resolverData;
}
