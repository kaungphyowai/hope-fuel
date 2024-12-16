import React, { useState } from "react";
import { Select, MenuItem, Typography, Box } from "@mui/material";

const WalletSelect = () => {
  const [wallet, setWallet] = useState("Wallet 1");

  const handleChange = (event) => {
    setWallet(event.target.value);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography fontWeight="bold">Wallet:</Typography>
      <Select
        value={wallet}
        onChange={handleChange}
        variant="outlined"
        displayEmpty
        renderValue={() => (
          <Box
            sx={{
              backgroundColor: "darkred",
              color: "white",
              px: 2,
              py: 0.5,
              borderRadius: "16px", // Makes it pill-shaped
              display: "inline-flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            {wallet}
          </Box>
        )}
        sx={{
          border: "none",
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // Remove default Select border
          },
          "& .MuiSvgIcon-root": {
            color: "black", // Customize the dropdown arrow
          },
        }}
      >
        <MenuItem value="Wallet 1">Wallet 1</MenuItem>
        <MenuItem value="Wallet 2">Wallet 2</MenuItem>
        <MenuItem value="Wallet 3">Wallet 3</MenuItem>
      </Select>
    </Box>
  );
};

export default WalletSelect;
