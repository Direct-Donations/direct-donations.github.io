import { DonateClient } from "@direct-donations/kit";
import algosdk, { Account, Algodv2, Indexer } from "algosdk";
import * as algokit from "@algorandfoundation/algokit-utils";
import {
  CREATOR,
  NODE_URL,
  NODE_TOKEN,
  NODE_PORT,
  INDEXER_PORT,
  INDEXER_TOKEN,
  INDEXER_URL,
} from "@/constants/env";
import { useWallet } from "@txnlab/use-wallet";
import { TransactionSignerAccount } from "@algorandfoundation/algokit-utils/types/account";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

let kit: DonateClient;
let algod: Algodv2;
let indexer: Indexer;

export default function useDonationKit() {
  const { signer, activeAddress } = useWallet();
  if (typeof algod === "undefined" || typeof indexer === "undefined") {
    algod = algokit.getAlgoClient({
      token: NODE_TOKEN,
      server: NODE_URL,
      port: NODE_PORT,
    });
    indexer = algokit.getAlgoIndexerClient({
      token: INDEXER_TOKEN,
      server: INDEXER_URL,
      port: INDEXER_PORT,
    });
  }
  kit = useMemo(() => {
    return new DonateClient(
      {
        resolveBy: "id",
        id: 1016,
        sender: { signer, addr: activeAddress } as TransactionSignerAccount,
      },
      algod,
    );
  }, [activeAddress]);
  return { kit, algod, indexer };
}
export async function donate(appClient, signer, from, to, amount) {
  console.log({ from, to, amount });
  const payment = algosdk.makePaymentTxnWithSuggestedParams(
    from.addr,
    to.addr,
    algokit.algos(amount).microAlgos,
    undefined,
    undefined,
    await algod.getTransactionParams().do(),
  );
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
      accounts: [from.addr, to.addr],
    },
  );
}
export function useUsersQuery() {
  const { kit, algod, indexer } = useDonationKit();
  const res = indexer.searchAccounts().do();
  return useQuery(["users"], async () => {
    return await indexer
      .searchAccounts()
      .applicationID(kit.appClient._appId)
      .exclude("created-apps")
      .do()
      .then(({ accounts }) => {
        return Promise.all(
          accounts.map(async (props) => {
            const local = await kit.getLocalState(props.address);
            return {
              local,
              ...props,
            };
          }),
        );
      });
  });
}
