import React from "react";
import { useWallet } from "@txnlab/use-wallet";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import useDonationKit from "@/hooks/use-donation-kit";
import { Account } from "algosdk";
import { TransactionSignerAccount } from "@algorandfoundation/algokit-utils/types/account";

async function reset(client, acc: Account, args: any) {
  try {
    await client.clearState({
      sender: acc,
    });
  } catch (e) {
    console.log("clearState error");
  } finally {
    await client.appClient.optIn({
      method: "register",
      sender: acc,
      methodArgs: args,
    });
  }
}
export default function Connect() {
  const { providers, activeAddress, signer, activeAccount } = useWallet();
  const { kit } = useDonationKit();
  const handleClick = () => {
    if (typeof activeAddress === "undefined") return;
    const args = ["Michael Feher", "Autistic Mad Scientist", "Lafayette, LA"];

    kit.appClient.optIn({
      method: "register",
      sender: {
        addr: activeAddress,
        signer,
      } as TransactionSignerAccount,
      methodArgs: args,
    });
  };
  return (
    <div>
      <Button onClick={handleClick}>Opt In</Button>
      {providers?.map((provider) => (
        <Box
          key={provider.metadata.id}
          sx={{ bgColor: provider.isActive ? "green" : "red" }}
        >
          <h4>
            <img
              width={30}
              height={30}
              alt={`${provider.metadata.name} icon`}
              src={provider.metadata.icon}
            />
            {provider.metadata.name} {provider.isActive && "[active]"}
          </h4>

          <ButtonGroup
            variant="contained"
            aria-label="outlined primary button group"
          >
            <Button
              color="primary"
              onClick={provider.connect}
              disabled={provider.isConnected}
            >
              Connect
            </Button>
            <Button
              color="error"
              onClick={provider.disconnect}
              disabled={!provider.isConnected}
            >
              Disconnect
            </Button>
            <Button
              color="success"
              onClick={provider.setActiveProvider}
              disabled={!provider.isConnected || provider.isActive}
            >
              Set Active
            </Button>
          </ButtonGroup>
          <div>
            {provider.isActive && provider.accounts.length && (
              <Select
                value={activeAccount?.address}
                onChange={(e) => provider.setActiveAccount(e.target.value)}
              >
                {provider.accounts.map((account) => (
                  <MenuItem key={account.address} value={account.address}>
                    {account.address}
                  </MenuItem>
                ))}
              </Select>
            )}
          </div>
        </Box>
      ))}
    </div>
  );
}
