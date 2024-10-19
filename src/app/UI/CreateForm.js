import { Autocomplete, Box, Button, FormControlLabel, FormLabel, ImageList, ImageListItem, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import createFormSubmit from '../utilites/createForm/createformSubmit'
import { v4 as uuidv4 } from 'uuid';
import filehandler from '../utilites/createForm/fileHandler';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { AgentContext, UserContext } from '../HomePage';

import Dropzone from 'react-dropzone'


import {SUPPORTREGIONCONST} from '../variables/const'
import { set } from 'date-fns';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});



const CreateForm = ({userInfo, setloading}) => {
  //LOAD THE WALLETS
  const [wallets, setwallets] = useState();
  const [currency, setcurrency] = useState();
  const [supportRegion, setsupportRegion] = useState("Choose a Region");
  const [supportRegions, setsupportRegions] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [files, setfiles] = useState([]);

  const [amountValidate, setAmountValidate] = useState(false);
  const [monthValidate, setmonthValidate] = useState(false);
  const [manyChatValidate, setmanyChatValidate] = useState(false);
  const [fileExist, setfileExist] = useState(false);
  const [submitted, setSubmitted] = useState(false);
    const [uploadProgress, setUploadProgress] = useState("")

  //Load the Wallet on Component Mount
  useEffect(() => {
    if (currency) {
      fetch(`/api/loadWalletByCurrency?currencyCode=${currency}`)
        .then((response) => response.json()) // Simplified to directly return the JSON response
        .then((data) => {
          console.log(":loadcurrency", currency);
          console.log("loadWalletByCurrencyResponse:", data);
          setwallets(data);
        })
        .catch((error) => {
          console.error("Error fetching wallets by currency code:", error);
        });
    }
  }, [currency]); // Ensure that the dependency array is properly closed

  useEffect(() => {
    fetch("/api/loadSupportRegion")
      .then((response) => response.json())
      .then((data) => {
        console.log("loadSupportRegionResponse:", data);
        setsupportRegions(data);
      })
      .catch((error) => {
        console.error("Error fetching support regions:", error);
      });
  }, []);

  // load currencies when component mount
  useEffect(() => {
    fetch("/api/getCurrencies")
      .then((response) => response.json())
      .then((data) => {
        setCurrencies(data);
      });
  }, []);

  const formFillingPerson = useContext(UserContext).username;
  console.log(SUPPORTREGIONCONST);
  const agentId = useContext(AgentContext).id;
  console.log("AgentId from createform: " + agentId);

  const handleSubmit = (event) => {
    
    if (files.length == 0) {
      setfileExist(false);
      return;
      
    }
    createFormSubmit(
      event,
      currency,
      supportRegion,
      files,
      userInfo,
      setloading,
      formFillingPerson,
      setAmountValidate,
      setmonthValidate,
      setmanyChatValidate,
      fileExist,
      setfileExist,
      agentId
    );

    setAmountValidate(false);
    setmonthValidate(false);
    setmanyChatValidate(false);
    setfileExist(false);
    setfiles([]);


   // window.location.reload();
  };

    return (
      <>
        <Typography component="h1" variant="h5">
          Create A New User
        </Typography>
        <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit}>
          <TextField
            autoFocus
            margin="normal"
            required
            fullWidth
            name="amount"
            label="Amount"
            type="text"
            id="amount"
            helperText={amountValidate && "ဂဏန်းဘဲသွင်းပါ"}
            error={amountValidate}
            InputProps={{
              inputProps: { min: 0 },
            }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="month"
            label="Month"
            name="month"
            helperText={monthValidate && "ဂဏန်းဘဲသွင်းပါ"}
            error={monthValidate}
            type="text"
            InputProps={{
              inputProps: { min: 1 },
            }}
          />

          <FormLabel id="currency">Currency</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="female"
            name="Currency"
            value={currency}
            row
            onChange={(event) => setcurrency(event.target.value)}
            sx={{ mx: 2 }}
          >
            {currencies.map((item) => {
              return (
                <FormControlLabel
                  value={item.CurrencyCode}
                  control={<Radio required={true} />}
                  label={item.CurrencyCode}
                  id={item.CurrencyID}
                />
              );
            })}
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

          <Autocomplete
            disablePortal
            id="supportRegion"
            onChange={(event, value) => {
              console.log(value);
              setsupportRegion(value);
            }}
            required
            options={supportRegions}
            sx={{ width: 300, marginTop: 2 }}
            value={supportRegion}
            defaultValue={() => setsupportRegion("choose a region")}
            getOptionLabel={(option) => option.Region || ""}
            renderInput={(params) => (
              <TextField {...params} label="Support Region" required />
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
            id="contactLink"
            label="Contact Person Link"
            name="contactLink"
            type="url"
          />
          <TextField
            margin="normal"
            fullWidth
            id="notes"
            label="Notes"
            name="notes"
            type="text-area"
          />

          <div
            style={{
              width: "100%",
              width: "100%",
              height: "50%",
              border: "1px solid black",
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.nativeEvent.dataTransfer.items[0].getAsString(function (url) {
                if (url == null) {
                  console.log("this run");
                  console.log(url);
                  return;
                }
                setfiles([...files, { href: url }]);
                setfileExist(true);
                console.log("setfileExist", fileExist);
              });
            }}
            onDragOver={(e) => {
              e.preventDefault();
            }}
          >
            <Dropzone
              onDrop={(acceptedFiles) => {
                filehandler(acceptedFiles, setfiles, files,setUploadProgress);
                setfileExist(true);
              }}
              accept={["text/*, img/*"]}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()} style={{ padding: "20% 20%" }}>
                    <input {...getInputProps()} />
                    <p>
                     { uploadProgress || "Drag & drop some files here, or click to select files"}
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
          </div>
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
          {/* <img src="https://scontent-sjc3-1.xx.fbcdn.net/v/t1.15752-9/412427936_1015944829699890_8378981739337620995_n.jpg?stp=dst-jpg_s206x206&_nc_cat=106&ccb=1-7&_nc_sid=510075&_nc_ohc=joGHU5pkTIkAX8JSUg8&_nc_ht=scontent-sjc3-1.xx&oh=03_AdQz0CYfwSTPMHBLD_ihYF3e_HUn5jxbzMuXWxZr0MNufw&oe=65AE1A89" /> */}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            Submit
          </Button>
          {submitted && (
            <Typography variant="h6" sx={{ mt: 2, color: "green" }}>
              Submitted
            </Typography>
          )}
        </Box>
      </>
    );

  }
export default CreateForm

