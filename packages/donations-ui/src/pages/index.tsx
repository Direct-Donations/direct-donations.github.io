import { useUsersQuery } from "@/hooks/use-donation-kit";
import Card from "@/components/Card";
import Grid from "@mui/material/Grid";
import { useWallet } from "@txnlab/use-wallet";
import useStateChange from "@/hooks/use-state-change";

export default function Home() {
  const { activeAddress } = useWallet();
  const { isLoading, data } = useUsersQuery();
  const block = useStateChange(activeAddress);
  return (
    <>
      {!data && isLoading && <p>Loading...</p>}
      <Grid container spacing={4}>
        {data &&
          data
            .filter((acc) => acc.address !== activeAddress)
            .map((user, key) => (
              <Grid key={key} item xs>
                <Card user={user} />
              </Grid>
            ))}
      </Grid>
    </>
  );
}
