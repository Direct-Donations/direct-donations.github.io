import "dotenv/config";
import { DonateClient } from "../src/index.js";

import algokit from "@algorandfoundation/algokit-utils";
import algosdk from "algosdk";
import type { Account } from "algosdk";
console.log(algokit);
console.log("=== Deploying Place ===");

const algod = algokit.getAlgoClient();
const indexer = algokit.getAlgoIndexerClient();
const deployer = await algokit.getAccount(
  {
    config: algokit.getAccountConfigFromEnvironment("DEPLOYER"),
    fundWith: algokit.algos(3000),
  },
  algod,
);
const user = await algokit.getAccount(
  {
    config: algokit.getAccountConfigFromEnvironment(
      "unencrypted-default-wallet",
    ),
    fundWith: algokit.algos(3000),
  },
  algod,
);
await algokit.ensureFunded(
  {
    accountToFund: deployer,
    minSpendingBalance: algokit.algos(2),
    minFundingIncrement: algokit.algos(2),
  },
  algod,
);
const isMainNet = await algokit.isMainNet(algod);
const appClient = new DonateClient(
  {
    resolveBy: "creatorAndName",
    findExistingUsing: indexer,
    sender: deployer,

    creatorAddress: deployer.addr,
  },
  algod,
);
const app = await appClient.deploy({
  // allowDelete: !isMainNet,
  // allowUpdate: !isMainNet,
  onSchemaBreak: isMainNet ? "append" : "replace",
  onUpdate: isMainNet ? "append" : "update",
});

// If app was just created fund the app account
if (["create", "replace"].includes(app.operationPerformed)) {
  algokit.transferAlgos(
    {
      amount: algokit.algos(1),
      from: deployer,
      to: app.appAddress,
    },
    algod,
  );
}
async function reset(acc: Account, args: any) {
  try {
    await appClient.clearState({
      sender: acc,
    });
  } catch (e) {
    console.log("clearState error");
  } finally {
    await appClient.appClient.optIn({
      method: "register",
      sender: acc,
      methodArgs: args,
    });
  }
}
async function donate(from: Account, to: Account, amount: number) {
  await appClient.donate(
    {
      txn: algosdk.makePaymentTxnWithSuggestedParams(
        from.addr,
        to.addr,
        algokit.algos(amount).microAlgos,
        undefined,
        undefined,
        await algod.getTransactionParams().do(),
      ),
    },
    {
      sender: from,
      accounts: [from.addr, to.addr],
    },
  );
}
await reset(deployer, [
  deployer.addr,
  ["Algorand Foundation", "Foundation Organization", "Boston, MA"],
]);
await reset(user, [
  user.addr,
  ["Michael Feher", "Autistic Mad Scientist", "Lafayette, LA"],
]);

await appClient.donate(
  {
    txn: algosdk.makePaymentTxnWithSuggestedParams(
      deployer.addr,
      user.addr,
      algokit.algos(20).microAlgos,
      undefined,
      undefined,
      await algod.getTransactionParams().do(),
    ),
  },
  {
    accounts: [deployer.addr, user.addr],
  },
);
await donate(deployer, user, 10);
await donate(user, deployer, 20);
await donate(deployer, user, 30);
await donate(user, deployer, 40);

const global = await appClient.appClient.getGlobalState();
// console.log("Global state", global);
console.log(global.managers, global.metadata);
