import { useEffect, useState } from "react";
import useDonationKit from "@/hooks/use-donation-kit";
import { Algodv2 } from "algosdk";

async function loop(client: Algodv2, block: number = 0) {
  const b = await client.statusAfterBlock(block).do();
  if (b?.txns?.length > 0) {
    console.log("found one");
  }
  loop(client, b["last-round"] + 1);
}
export default function useStateChange(address: string | undefined) {
  const { algod } = useDonationKit();
  const [block, setBlock] = useState(0);
  useEffect(() => {
    if (!address || !algod) return;
    loop(algod, block);
  }, [address, algod, block]);

  return block;
}
