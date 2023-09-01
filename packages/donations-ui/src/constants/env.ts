export const CREATOR = process.env.NEXT_PUBLIC_CREATOR_ADDRESS || "";
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || "testnet";
export const NODE_NETWORK = process.env.NEXT_PUBLIC_ALGOD_NETWORK || "";
export const NODE_URL =
  process.env.NEXT_PUBLIC_ALGOD_SERVER ||
  "https://xna-mainnet-api.algonode.cloud";
export const NODE_TOKEN = process.env.NEXT_PUBLIC_ALGOD_TOKEN || "";
export const NODE_PORT = process.env.NEXT_PUBLIC_ALGOD_PORT
  ? parseInt(process.env.NEXT_PUBLIC_ALGOD_PORT)
  : 443;

export const INDEXER_URL =
  process.env.NEXT_PUBLIC_INDEXER_SERVER ||
  "https://testnet-idx.algonode.cloud";
export const INDEXER_TOKEN = process.env.NEXT_PUBLIC_INDEXER_TOKEN || "";
console.log(INDEXER_TOKEN);
export const INDEXER_PORT = process.env.NEXT_PUBLIC_INDEXER_PORT
  ? parseInt(process.env.NEXT_PUBLIC_INDEXER_PORT)
  : 443;
