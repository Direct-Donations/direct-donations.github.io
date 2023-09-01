import useDonationKit, { useUsersQuery } from "@/hooks/use-donation-kit";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import validator from "@rjsf/validator-ajv8";
import MUIForm from "@rjsf/mui";
import { RJSFSchema } from "@rjsf/utils";
import { makePaymentTxnWithSuggestedParams } from "algosdk";
import * as algokit from "@algorandfoundation/algokit-utils";
import { useWallet } from "@txnlab/use-wallet";

const schema: RJSFSchema = {
  title: "Donate",
  type: "object",
  properties: {
    address: {
      type: "string",
      title: "Address",
    },
    amount: {
      type: "number",
      title: "Algos",
    },
  },
  required: ["address", "amount"],
};

export default function Donate() {
  const { activeAddress, activeAccount, signer, isReady } = useWallet();
  const { kit, algod } = useDonationKit();
  const { isLoading, data, refetch } = useUsersQuery();
  const router = useRouter();
  const address = router.query.address;

  type FormDataType = {
    address: string;
    amount: number;
  };
  const handleSubmit = async ({ formData }: { formData: FormDataType }) => {
    if (typeof activeAddress === "undefined") {
      throw new Error("Must have active wallet");
    }
    await kit.donate(
      {
        txn: makePaymentTxnWithSuggestedParams(
          activeAddress,
          formData.address,
          algokit.algos(formData.amount).microAlgos,
          undefined,
          undefined,
          await algod.getTransactionParams().do(),
        ),
      },
      {
        sendParams: {
          suppressLog: true,
        },
        accounts: [activeAddress, formData.address],
      },
    );
    refetch();
    router.push(router.pathname);
  };

  return isLoading ? (
    <CircularProgress />
  ) : (
    <MUIForm
      onSubmit={handleSubmit}
      schema={schema}
      validator={validator}
      formData={{ address, amount: 100 }}
    />
  );
}
