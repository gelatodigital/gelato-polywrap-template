import { getWeb3ApiClient } from "./utils";

const main = async () => {
  const PROD_URI = "w3://ipfs/QmUScQWHJhtuGCyfkVXi81XK9XChJ9rdV1k5wJD8Y6ptAs";

  const goerliClient = await getWeb3ApiClient("goerli", "prod");
  const maticClient = await getWeb3ApiClient("matic", "prod");

  const counterCheckerGoerli = await goerliClient.query({
    uri: PROD_URI,
    query: `
        query counterCheckerGoerli{
          counterCheckerGoerli
        }`,
  });

  console.log(counterCheckerGoerli.data);

  const counterCheckerMatic = await maticClient.query({
    uri: PROD_URI,
    query: `
        query counterCheckerMatic{
          counterCheckerMatic
        }`,
  });

  console.log(counterCheckerMatic.data);
};

main();
