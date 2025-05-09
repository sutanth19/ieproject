import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert    from "@mui/material/Alert";

const SnackbarAlert = ({ open, msg, sev, onClose }) => (
  <Snackbar open={open} autoHideDuration={4000} onClose={onClose}
            anchorOrigin={{ vertical:"bottom", horizontal:"center" }}>
    <Alert severity={sev} onClose={onClose} sx={{ width:"100%" }}>{msg}</Alert>
  </Snackbar>
);

export default SnackbarAlert;
