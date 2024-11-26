import React from "react";
import { Stack, Button, Typography } from "@mui/material";

const ActionButtons = ({ data }) => {
  const [loading, setLoading] = React.useState(false);
  const [confirmDenyFlag, setConfirmDenyFlag] = React.useState(null);

  if (!data || !data.HopeFuelID) {
    console.error("Invalid data passed to ActionButtons:", data);
    return null;
  }

  const handleAction = async (denied) => {
    setLoading(true);

    const payload = {
      denied,
      HopeFuelID: data.HopeFuelID,
      note: data.Note,
      formStatus: data.Status,
      AgentId: data.AgentId,
    };

    try {
      const response = await fetch("/api/paymentConfirmOrDeined", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(
          `Payment ${denied ? "Denied" : "Confirmed"} successfully`,
          result
        );
        setConfirmDenyFlag(denied ? "denied" : "confirmed");
      } else {
        console.error("Failed to process payment");
        setConfirmDenyFlag("error");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setConfirmDenyFlag("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
      <Button
        variant="contained"
        color="error"
        sx={{ width: "150px" }}
        onClick={() => handleAction(0)}
        disabled={loading}
      >
        Confirm
      </Button>
      <Button
        variant="outlined"
        color="error"
        sx={{ width: "150px" }}
        onClick={() => handleAction(1)}
        disabled={loading}
      >
        Deny
      </Button>

      {confirmDenyFlag === "confirmed" && (
        <Typography variant="body2" color="success.main">
          Payment Confirmed
        </Typography>
      )}
      {confirmDenyFlag === "denied" && (
        <Typography variant="body2" color="error">
          Payment Denied
        </Typography>
      )}
      {confirmDenyFlag === "error" && (
        <Typography variant="body2" color="error">
          An error occurred. Please try again.
        </Typography>
      )}
    </Stack>
  );
};

export default ActionButtons;
