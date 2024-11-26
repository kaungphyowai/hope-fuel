"use client";
import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  ImageList,
  ImageListItem,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import extendFormSubmit from "../utilites/extendForm/extendFormSubmit";
import filehandler from "../utilites/createForm/fileHandler";
import { useUser } from "../context/UserContext";
import { useAgent } from "../context/AgentContext";


const ExtendForm = ({ userInfo, setloading }) => {
  const user = useUser();
  const agent = useAgent();
console.log("User from ExtendForm: ", user);
  const formFillingPerson = user?.email || "Unknown User";


  const [wallets, setWallets] = useState([]);
  const [currency, setCurrency] = useState("");
  const [walletId, setWalletId] = useState(null);
  const [supportRegion, setSupportRegion] = useState("");
  const [supportRegions, setSupportRegions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [files, setFiles] = useState([]);
  const [amountValidate, setAmountValidate] = useState(false);
  const [monthValidate, setMonthValidate] = useState(false);
  const [manyChatValidate, setManyChatValidate] = useState(false);
  const [fileExist, setFileExist] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [contactLink, setContactLink] = useState("");
  const [notes, setNotes] = useState("");
  const [manyChatId, setManyChatId] = useState("");

  // Load Wallets by Currency
  useEffect(() => {
    if (currency) {
      fetch(`/api/loadWalletByCurrency?currencyCode=${currency}`)
        .then((response) => response.json())
        .then((data) => setWallets(data))
        .catch((error) => console.error("Error fetching wallets:", error));
    }
  }, [currency]);

  // Load Support Regions
  useEffect(() => {
    fetch("/api/loadSupportRegion")
      .then((response) => response.json())
      .then((data) => setSupportRegions(data))
      .catch((error) =>
        console.error("Error fetching support regions:", error)
      );
  }, []);

  // Load Currencies
  useEffect(() => {
    fetch("/api/getCurrencies")
      .then((response) => response.json())
      .then((data) => setCurrencies(data))
      .catch((error) => console.error("Error fetching currencies:", error));
  }, []);

  const handleDrop = async (acceptedFiles) => {
    setIsUploading(true);
    await filehandler(acceptedFiles, setFiles, files, setUploadProgress);
    setFileExist(acceptedFiles.length > 0);
    setIsUploading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (files.length === 0) {
      setFileExist(false);
      return;
    }

    extendFormSubmit(
      event,
      currency,
      supportRegion,
      files,
      userInfo,
      setloading,
      formFillingPerson,
      setAmountValidate,
      setMonthValidate,
      setManyChatValidate,
      fileExist,
      setFileExist,
      agent,
      contactLink,
      notes,
      manyChatId,
      walletId
    );

    setFiles([]);
    setSubmitted(true);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography component="h1" variant="h5">
        Extend User Membership
      </Typography>

      {/* PRF No */}
      <TextField
        fullWidth
        name="prf_no"
        label="PRF No"
        value={userInfo.prf_no}
        disabled
        margin="normal"
      />

      {/* Amount Input */}
      <TextField
        required
        fullWidth
        name="amount"
        label="Amount"
        type="number"
        id="amount"
        margin="normal"
        error={amountValidate}
        helperText={amountValidate && "Please enter a valid amount"}
      />

      {/* Month Input */}
      <TextField
        required
        fullWidth
        name="month"
        label="Month"
        type="number"
        id="month"
        margin="normal"
        error={monthValidate}
        helperText={monthValidate && "Please enter a valid month"}
      />

      {/* Currency Selection */}
      <FormLabel>Currency</FormLabel>
      <RadioGroup
        row
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      >
        {currencies.map((item) => (
          <FormControlLabel
            key={item.CurrencyID}
            value={item.CurrencyCode}
            control={<Radio />}
            label={item.CurrencyCode}
          />
        ))}
      </RadioGroup>

      {/* wallet selection*/}
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

      {/* Support Region Selection */}
      <Autocomplete
        disablePortal
        options={supportRegions}
        getOptionLabel={(option) => option.Region || ""}
        onChange={(e, value) => setSupportRegion(value)}
        renderInput={(params) => (
          <TextField {...params} label="Support Region" required />
        )}
        sx={{ mt: 3 }}
      />

      {/* ManyChat ID Input */}
      <TextField
        fullWidth
        id="manyChat"
        name="manyChat"
        label="ManyChat ID"
        value={manyChatId}
        onChange={(e) => setManyChatId(e.target.value)}
        margin="normal"
        error={manyChatValidate}
        helperText={manyChatValidate && "Please enter a valid ManyChat ID"}
      />

      {/* Contact Link Input */}
      <TextField
        fullWidth
        name="contactLink"
        label="Contact Person Link"
        value={contactLink}
        onChange={(e) => setContactLink(e.target.value)}
        margin="normal"
      />

      {/* Notes Input */}
      <TextField
        fullWidth
        name="notes"
        label="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        margin="normal"
      />

      {/* Dropzone for File Upload */}
      <Dropzone onDrop={handleDrop} accept={{ "image/*": [] }} multiple>
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              border: "2px dashed #ddd",
              padding: "20px",
              marginTop: "20px",
              textAlign: "center",
            }}
          >
            <input {...getInputProps()} />
            <p>
              {uploadProgress || "Drag & drop files here, or click to select"}
            </p>
            {isUploading && <CircularProgress sx={{ mt: 2 }} />}
          </div>
        )}
      </Dropzone>

      {/* Uploaded Images Preview */}
      {files.length > 0 && (
        <ImageList cols={3} rowHeight={164} sx={{ mt: 2 }}>
          {files.map((file, index) => (
            <ImageListItem key={index}>
              <img src={file.href} alt={file.name} loading="lazy" />
            </ImageListItem>
          ))}
        </ImageList>
      )}

      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
        {submitted ? "Submitted" : "Submit"}
      </Button>
    </Box>
  );
};

export default ExtendForm;
