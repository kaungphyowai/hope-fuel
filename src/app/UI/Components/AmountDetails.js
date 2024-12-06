import { Box, Typography, Card, Chip, Stack } from "@mui/material";

const AmountDetails = ({ amount }) => {
  if (!amount) return <p>No data available in AmountDetails</p>;

  return (
    <Box sx={{ padding: 3 }}>
      {/* Wallet and Currency Information */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        mb={3}
      >
        <Chip
          label={amount?.CurrencyCode || "No Currency"}
          color="error"
          sx={{ fontWeight: "bold" }}
        />
        <Chip
          label={amount?.WalletName || "No Wallet"}
          sx={{ fontWeight: "bold" }}
        />
      </Stack>

      {/* Total Amount and Total Month */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems="center"
        justifyContent="space-around"
      >
        <Card
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: 180,
            textAlign: "center",
            padding: 3,
            boxShadow: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Total Amount
          </Typography>
          <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
            {amount?.Amount ? parseFloat(amount?.Amount).toFixed(2) : "N/A"}
          </Typography>
        </Card>

        <Card
          variant="outlined"
          sx={{
            flex: 1,
            minWidth: 180,
            textAlign: "center",
            padding: 3,
            boxShadow: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Total Month
          </Typography>
          <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
            {amount?.Month || "N/A"}
          </Typography>
        </Card>
      </Stack>
    </Box>
  );
};

export default AmountDetails;
