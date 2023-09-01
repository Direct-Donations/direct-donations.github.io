import Box from "@mui/material/Box";
import Connect from "@/components/Connect";
import Donate from "@/components/Donate";
import MUIModal from "@mui/material/Modal";
import { ElementType, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { CircularProgress } from "@mui/material";

const PANELS: { [index: string]: ElementType } = {
  connect: Connect,
  donate: Donate,
};
const Loading = () => <CircularProgress />;
export function Modal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const Panel = useMemo(() => {
    if (!router.query.panel) {
      setOpen(false);
      return Loading;
    }
    setOpen(true);
    return PANELS[router.query.panel as string];
  }, [router.query.panel]);

  const handleClose = () => {
    setOpen(false);
    router.push(router.pathname);
  };
  return (
    <MUIModal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 800,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Panel />
      </Box>
    </MUIModal>
  );
}

export default Modal;
