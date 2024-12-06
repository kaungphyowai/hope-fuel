"use client";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Alert,
  AlertTitle,
  Typography,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Autocomplete,
  ImageList,
  ImageListItem,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import { useAgent } from "../context/AgentContext";
import { MuiOtpInput } from "mui-one-time-password-input";
import checkPrfSubmit from "../utilites/ExtendUser/checkPrfSubmit";
import extendUserSubmit from "../utilites/ExtendUser/extendUserSubmit";
import ExtendOrNot from "../createForm/extendOrNot";
import Dropzone from "react-dropzone";
import filehandler from "../utilites/createForm/fileHandler";
import { set } from "date-fns";

const ExtendUserForm = ({ userRole }) => {
  const user = useUser();
  const agent = useAgent();

  const [otp, setOtp] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [isChecking, setIsChecking] = useState(false);
  const [userExist, setUserExist] = useState(false);
  const [hasPermissionThisMonth, setHasPermissionThisMonth] = useState(true);
  const [checkInputComplete, setCheckInputComplete] = useState(false);
  const [hasContinue, setHasContinue] = useState(false);

  // Form fields
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState("");
  const [manyChat, setManyChat] = useState("");
  const [contactLink, setContactLink] = useState("");
  const [notes, setNotes] = useState("");

  // Dropdowns and Autocomplete
  const [currency, setCurrency] = useState("");
  const [currencies, setCurrencies] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [supportRegion, setSupportRegion] = useState("");
  const [supportRegions, setSupportRegions] = useState([]);

  // File handling
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState("");
  const [fileExist, setFileExist] = useState(true);

  //Validation
  const [manyChatValidate, setManyChatValidate] = useState(false);
  const [amountValidate, setAmountValidate] = useState(false);
  const [monthValidate, setMonthValidate] = useState(false);

  const formFillingPerson = user?.Email || "Unknown User";
  console.log("formFillingPerson", formFillingPerson);
  const agentId = agent || "No Agent";

  // Fetch currencies, wallets, and support regions
  useEffect(() => {
    fetch("/api/getCurrencies")
      .then((res) => res.json())
      .then(setCurrencies)
      .catch(console.error);

    fetch("/api/loadSupportRegion")
      .then((res) => res.json())
      .then(setSupportRegions)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (currency) {
      fetch(`/api/loadWalletByCurrency?currencyCode=${currency}`)
        .then((res) => res.json())
        .then(setWallets)
        .catch(console.error);
    }
  }, [currency]);

  // Handle OTP completion
  const handleOtpComplete = async (value) => {
    setCheckInputComplete(true);
    setIsChecking(true);

    await checkPrfSubmit(
      value,
      setUserExist,
      setIsChecking,
      setUserInfo,
      setHasPermissionThisMonth,
      userRole
    );
    console.log;
    setIsChecking(false);
  };
  // Log userInfo to ensure it's an object and not a boolean
  console.log("User Info after check:", userInfo);

  // Handle decline action
  const handleDecline = () => {
    setOtp("");
    setUserInfo({});
    setHasContinue(false);
    setUserExist(false);
    setCheckInputComplete(false);
    setAmount("");
    setMonth("");
    setCurrency("");
    setSupportRegion("");
    setFiles([]);
  };

  // Handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    await extendUserSubmit(
      event,
      userInfo,
      amount,
      month,
      setAmountValidate,
      setMonthValidate,
      setManyChatValidate,
      formFillingPerson,
      agentId,
      currency,
      supportRegion,
      files,
      fileExist,
      setFileExist,
      wallets,
      manyChat,
      contactLink,
      notes
    );
  };

  // Handle file upload
  const handleDrop = async (acceptedFiles) => {
    await filehandler(acceptedFiles, setFiles, files, setUploadProgress);
    setFileExist(acceptedFiles.length > 0);
  };
  console.log("userInfo", userInfo);
  return (
    <Box sx={{ mt: 4, marginLeft: 15, marginRight: 15 }}>
      <MuiOtpInput
        value={otp}
        length={7}
        onComplete={handleOtpComplete}
        onChange={setOtp}
      />

      {isChecking && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>Checking user...</Typography>
        </Box>
      )}

      {!isChecking && userExist && !hasContinue && hasPermissionThisMonth && (
        <ExtendOrNot
          userInfo={userInfo}
          onConfirm={() => setHasContinue(true)}
          onDecline={handleDecline}
        />
      )}

      {hasContinue && (
        <Box component="form" onSubmit={handleFormSubmit}>
          <Typography component="h1" variant="h5" sx={{ mt: 8, mb: 4 }}>
            Extend User Membership
          </Typography>

          <TextField
            label="Amount"
            fullWidth
            required
            value={amount}
            error={amountValidate}
            helperText={amountValidate && "Please enter a valid amount"}
            sx={{ mt: 2 }}
            inputProps={{ min: "0", step: "0.01" }}
            onChange={(e) => {
              
              const value = e.target.value;
              setAmount(value);
              if (!/^\d+(\.\d{0,2})?$/.test(value) || value <= 0) {
                setAmountValidate(true); // Custom state to show error
              } else {
                setAmountValidate(false);
              }
            }}
          />
          <TextField
            label="Month"
            fullWidth
            required
            value={month}
            sx={{ mt: 2 }}
            error={monthValidate}
            helperText={monthValidate && "Please enter a valid month"}
            onChange={(e) => {
              setMonth(e.target.value);
              if (e.target.value < 1 || e.target.value > 12) {
                setMonthValidate(true);
              } else {
                setMonthValidate(false);
              }
            }}
          />

          <FormLabel>Currency</FormLabel>
          <RadioGroup row onChange={(e) => setCurrency(e.target.value)}>
            {currencies.map((item) => (
              <FormControlLabel
                key={item.CurrencyId}
                value={item.CurrencyCode}
                control={<Radio />}
                label={item.CurrencyCode}
              />
            ))}
          </RadioGroup>
          <FormLabel id="wallets">Wallets</FormLabel>
          {wallets && wallets.length > 0 ? (
            <RadioGroup aria-labelledby="wallets-group-label" name="wallets">
              {wallets.map((wallet) => (
                <FormControlLabel
                  value={wallet.WalletID}
                  control={<Radio />}
                  label={wallet.WalletName}
                  key={wallet.WalletID}
                  required={true}
                  sx={{ mx: 1 }}
                />
              ))}
            </RadioGroup>
          ) : (
            <h1>No wallets selected.</h1>
          )}

          {wallets.length === 0 && currency && (
            <Typography>
              No wallets available for the selected currency.
            </Typography>
          )}

          <Autocomplete
            options={supportRegions}
            getOptionLabel={(option) => option.Region || ""}
            onChange={(event, value) => setSupportRegion(value)}
            renderInput={(params) => (
              <TextField {...params} label="Support Region" />
            )}
          />
          <TextField
            margin="normal"
            fullWidth
            id="manyChat"
            label="Many Chat ID"
            required
            name="manyChat"
            type="text"
            error={manyChatValidate}
            helperText={manyChatValidate && "ဂဏန်းဘဲသွင်းပါ"}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Contact Link"
            value={contactLink}
            onChange={(e) => setContactLink(e.target.value)}
          />

          <TextField
            margin="normal"
            fullWidth
            label="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <Dropzone onDrop={handleDrop}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                style={{
                  border: "2px dashed #ddd",
                  padding: "20px",
                  marginTop: "20px",
                }}
              >
                <input {...getInputProps()} />
                <Typography>
                  {uploadProgress ||
                    "Drag & drop files here, or click to select"}
                </Typography>
              </div>
            )}
          </Dropzone>
          {!fileExist && (
            <p style={{ color: "red" }}>You need to have a file</p>
          )}
          {files.length != 0 && (
            <ImageList
              sx={{ width: 500, height: 200 }}
              cols={3}
              rowHeight={164}
            >
              {files.map((item) => (
                <ImageListItem key={item.href}>
                  <img src={`${item.href}`} alt={"hello"} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Submit
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ExtendUserForm;
