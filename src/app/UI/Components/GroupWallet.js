import React, { useState , useEffect} from "react";
import { Select, MenuItem, Typography, Box } from "@mui/material";

const WalletSelect = () => {
const [currentWallet, setCurrentWallet]= useState("Select Wallet");
  const [wallets, setWallets] = useState([]);

  const handleChange = (event) => {
    setCurrentWallet(event.target.value);
  };

  //getting all wallets from DB
  useEffect(()=>{
    const fetchAllWallets=async()=>{
        try {
            const response = await fetch(`/api/loadWalletByCurrency`);
               const result = await response.json();
               console.log("Wallets from DB", result);
               setWallets(result);
                  if (result.length > 0) {
                    setCurrentWallet(result[0].WalletName); //default wallet
                  }

        } catch (error) {
            
        }
    }
    fetchAllWallets();
  },[])

  

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography fontWeight="bold">Wallet:</Typography>
      <Select
        value={currentWallet}
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
            {currentWallet || "Select a wallet"}
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
      
        {wallets.length > 0 ? (
          wallets.map((wallet, index) => (
            <MenuItem key={index} value={wallet.WalletName}>
              {wallet.WalletName}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>No wallets available!</MenuItem>
        )}
      </Select>
    </Box>
  );
};

export default WalletSelect;
