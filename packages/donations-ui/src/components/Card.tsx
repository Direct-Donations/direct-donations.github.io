import * as React from "react";
import Avatar from "@mui/material/Avatar";
import MUICard, { CardProps as MUICardProps } from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import { Button, CardActions } from "@mui/material";
import { useWallet } from "@txnlab/use-wallet";
import { useRouter } from "next/router";
import Link from "next/link";
import type { User } from "@/index";

type CardProps = {
  user: User;
} & MUICardProps;
export default function Card({ user, ...props }: CardProps) {
  const { activeAddress, isReady } = useWallet();
  const router = useRouter();
  const isCurrentUser = activeAddress === user.address;
  return (
    <MUICard {...props}>
      <CardHeader
        avatar={<Avatar aria-label="recipe"></Avatar>}
        title={user.local.name}
        subheader={user.address}
      />
      {user.local.image && (
        <CardMedia component="img" height="194" image={user.local.image} />
      )}
      <CardContent>
        <p>Wallet: {user.address}</p>
        <p>Wallet Total: {user.amount.microAlgos().algos} ALGOS</p>
        <p>Received: {user.local.donations.asNumber()} Donations</p>
        <p>
          Total In:
          {user.local.received.asNumber().microAlgos().algos}
        </p>
        <p>Total Out {user.local.given.asNumber().microAlgos().algos}</p>
      </CardContent>
      {isReady && activeAddress && !isCurrentUser && (
        <CardActions>
          <Button
            component={Link}
            href={`${router.pathname}?panel=donate&address=${user.address}`}
          >
            Donate
          </Button>
        </CardActions>
      )}
    </MUICard>
  );
}
