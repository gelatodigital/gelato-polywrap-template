import { getWeb3ApiClient } from "./utils";
import { encode } from "@msgpack/msgpack";

const main = async () => {
  const TEST_URI = "w3://ipfs/QmdwhegcY5RHHt29x3yGZKxeNvbKBQexvaAmKAMDG3Xfgz";

  const client = await getWeb3ApiClient("goerli", "prod");

  const userConfig = {
    counterAddress: "0xaBB322c65e9E0F8c7D4f28F3a5Deb8084aF6d2F4",
  };
  const buffer = encode(userConfig);

  const checker = await client.query({
    uri: TEST_URI,
    query: `
      query {
        checker(
          argBuffer: $arg
        )
      }`,
    variables: {
      arg: buffer,
    },
  });

  console.log(checker);
};

main();
