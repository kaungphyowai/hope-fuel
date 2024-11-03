import {
  Autocomplete,
  Box,
  Button,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import extendFormSubmit from '../utilites/extendForm/extendFormSubmit';
import filehandler from '../utilites/createForm/fileHandler';
import { UserContext, AgentContext } from '../HomePage';
import { SUPPORTREGIONCONST } from '../variables/const';
import Dropzone from 'react-dropzone';

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

const ExtendForm = ({ userInfo, setloading }) => {
  const [wallets, setwallets] = useState();
  const [currency, setcurrency] = useState();
  const [supportRegion, setsupportRegion] = useState('choose your region');
  const [currencies, setCurrencies] = useState([]);
  const [files, setfiles] = useState([]);
  const [supportRegions, setsupportRegions] = useState([]);

  const [amountValidate, setAmountValidate] = useState(false);
  const [monthValidate, setmonthValidate] = useState(false);
  const [manyChatValidate, setmanyChatValidate] = useState(false);
  const [fileExist, setfileExist] = useState(true);
  const [uploadProgress, setUploadProgress] = useState('');

  const agentId = useContext(AgentContext).id;

  //Load the Wallet on Component Mount
  useEffect(() => {
    if (currency) {
      fetch(`/api/loadWalletByCurrency?currencyCode=${currency}`)
        .then((response) => {
          return response.json(); // Ensure response.json() is returned
        })
        .then((data) => {
          console.log(':loadcurrency', currency);
          console.log('loadWalletByCurrencyResponse:', data);
          setwallets(data);
        })
        .catch((error) => {
          console.error('Error fetching wallets by currency code:', error);
        });
    }
  }, [currency]);

  //load support Region
  useEffect(() => {
    fetch('/api/loadSupportRegion')
      .then((response) => response.json())
      .then((data) => {
        console.log('loadSupportRegionResponse:', data);
        setsupportRegions(data);
      })
      .catch((error) => {
        console.error('Error fetching support regions:', error);
      });
  }, []);

  // load currencies when component mount
  useEffect(() => {
    fetch('/api/getCurrencies')
      .then((response) => response.json())
      .then((data) => {
        setCurrencies(data);
      });
  }, []);

  //Load the Wallet on Component Mount
  useEffect(() => {
    fetch('/api/loadWallet')
      .then((response) => response.json())
      .then((data) => setwallets(data));
  }, []);

  const formFillingPerson = useContext(UserContext).username;
  return (
    <>
      <Typography component="h1" variant="h5">
        Extend this User
      </Typography>
      <Box
        component="form"
        sx={{ mt: 1 }}
        onSubmit={(event) =>
          extendFormSubmit(
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
            agentId,
          )
        }
      >
        <FormLabel id="prf_no">PRF No</FormLabel>
        <TextField
          autoFocus
          margin="normal"
          required
          fullWidth
          name="prf_no"
          type="text"
          value={userInfo['prf_no']}
          disabled
          id="prf_no"
          InputProps={{
            inputProps: { min: 0 },
          }}
        />
        <TextField
          autoFocus
          margin="normal"
          required
          fullWidth
          name="amount"
          label="Amount"
          type="text"
          id="amount"
          helperText={amountValidate && 'ဂဏန်းဘဲသွင်းပါ'}
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
          helperText={monthValidate && 'ဂဏန်းဘဲသွင်းပါ'}
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
          onChange={(event, value) => setsupportRegion(value)}
          required
          defaultValue={() => setsupportRegion('choose a region')}
          options={supportRegions}
          getOptionLabel={(option) => option.Region || ''}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Support Region" required />
          )}
        />
        <TextField
          margin="normal"
          fullWidth
          id="manychat"
          label="Many Chat ID"
          required
          name="manychat"
          type="text"
          error={manyChatValidate}
          helperText={manyChatValidate && 'ဂဏန်းဘဲသွင်းပါ'}
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
            width: '100%',
            width: '100%',
            height: '50%',
            border: '1px solid black',
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.nativeEvent.dataTransfer.items[0].getAsString(function (url) {
              console.log(url);
              if (url == null) {
                console.log('this run');
                console.log(url);
                return;
              }
              setfiles([...files, { href: url }]);
            });
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          <Dropzone
            onDrop={(acceptedFiles) => {
              filehandler(acceptedFiles, setfiles, files, setUploadProgress);
              setfileExist(true);
            }}
            accept={['text/*, img/*']}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()} style={{ padding: '20% 20%' }}>
                  <input {...getInputProps()} />
                  <p>
                    {uploadProgress ||
                      'Drag & drop some files here, or click to select files'}
                  </p>
                </div>
              </section>
            )}
          </Dropzone>
        </div>
        {!fileExist && <p style={{ color: 'red' }}>You need to have a file</p>}
        {files ? (
          files.map((url) => (
            <img style={{ width: 100, height: 100 }} src={url.href} />
          ))
        ) : (
          <h1>Hello</h1>
        )}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Submit
        </Button>
      </Box>
    </>
  );
};

export default ExtendForm;
