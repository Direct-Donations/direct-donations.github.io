import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();
import type { ProvidersArray } from "@txnlab/use-wallet";
import {
  WalletProvider,
  useInitializeProviders,
  PROVIDER_ID,
} from "@txnlab/use-wallet";
import { WalletConnectModalSign } from "@walletconnect/modal-sign-html";
import { DeflyWalletConnect } from "@blockshake/defly-connect";
import { PeraWalletConnect } from "@perawallet/connect";
import { DaffiWalletConnect } from "@daffiwallet/connect";
import {
  NODE_NETWORK,
  NODE_PORT,
  NODE_TOKEN,
  NODE_URL,
  ENVIRONMENT,
} from "@/constants/env";
import * as algosdk from "algosdk";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { CacheProvider } from "@emotion/react";
import createEmotionCache from "@/emotion";
import theme from "@/theme";
import Layout from "@/Layout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const clientSideEmotionCache = createEmotionCache();

type MuiAppProps = AppProps & {
  emotionCache?: ReturnType<typeof createEmotionCache>;
};
export default function App({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: MuiAppProps) {
  const providers: ProvidersArray = [
    { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
    { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
    { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
    { id: PROVIDER_ID.EXODUS },
    {
      id: PROVIDER_ID.WALLETCONNECT,
      clientStatic: WalletConnectModalSign,
      clientOptions: {
        projectId: process.env.NEXT_PUBLIC_WC2_PROJECT_ID || "",
        relayUrl: process.env.NEXT_PUBLIC_WC2_RELAY_URL,
        metadata: {
          name: "next-use-wallet",
          description: "Next.js @txnlab/use-wallet example",
          url: "https://next-use-wallet.vercel.app/",
          icons: ["https://next-use-wallet.vercel.app/nfd.svg"],
        },
        modalOptions: {
          explorerRecommendedWalletIds: [
            // Fireblocks desktop wallet
            "5864e2ced7c293ed18ac35e0db085c09ed567d67346ccb6f58a0327a75137489",
          ],
        },
      },
    },
  ];
  if (ENVIRONMENT === "local") {
    providers.push({ id: PROVIDER_ID.KMD });
  }
  const walletProviders = useInitializeProviders({
    providers,
    nodeConfig: {
      network: NODE_NETWORK,
      nodeServer: NODE_URL,
      nodePort: NODE_PORT,
      nodeToken: NODE_TOKEN,
    },
    algosdkStatic: algosdk,
    debug: true,
  });

  return (
    <WalletProvider value={walletProviders}>
      <QueryClientProvider client={queryClient}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </CacheProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </WalletProvider>
  );
}
