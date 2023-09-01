import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Head from "next/head";
import { useWallet } from "@txnlab/use-wallet";
import { CircularProgress } from "@mui/material";
import Modal from "@/components/Modal";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  const { activeAccount, isReady } = useWallet();
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Direct Donations</title>
        <meta name="description" content="Mutual Aid on Algorand" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <AppBar component="nav" position="sticky" sx={{ flex: 0 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Direct Donations
            </Typography>
            <Button
              color="inherit"
              disabled={!isReady}
              onClick={() => router.push(`${router.pathname}/?panel=connect`)}
            >
              {!isReady ? (
                <CircularProgress color="warning" />
              ) : activeAccount ? (
                "Settings"
              ) : (
                "Connect Wallet"
              )}
            </Button>
          </Toolbar>
        </AppBar>
        <Container component="main">{children}</Container>
        <Modal />
      </Box>
    </>
  );
}
