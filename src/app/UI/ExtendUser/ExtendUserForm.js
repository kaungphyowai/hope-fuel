import {
  Alert,
  AlertTitle,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormLabel,
  ImageList,
  ImageListItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import extendUserSubmit from '../../utilites/ExtendUser/extendUserSubmit';
import { styled } from '@mui/material/styles';
import { UserContext, AgentContext } from '../../HomePage';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import filehandler from '../../utilites/createForm/fileHandler';
import checkPrfSubmit from '../../utilites/ExtendUser/checkPrfSubmit';
import { SUPPORTREGIONCONST } from '../../variables/const';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { ExtendOrNot } from '../ExtendOrNot';
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

const ExtendUserForm = ({ userRole }) => {
  const [loading, setloading] = useState(false);
  //LOAD THE WALLETS
  const [wallets, setwallets] = useState();
  const [currency, setcurrency] = useState();
  const [currencies, setCurrencies] = useState([]);
  const [supportRegion, setsupportRegion] = useState('choose your region');
  const [supportRegions, setsupportRegions] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [files, setfiles] = useState([]);

  const [amountValidate, setAmountValidate] = useState(false);
  const [monthValidate, setmonthValidate] = useState(false);
  const [manyChatValidate, setmanyChatValidate] = useState(false);

  //check if the user exist
  const [userExist, setuserExist] = useState();
  const [checkInputComplete, setcheckInputComplete] = useState(false);
  const [isChecking, setisChecking] = useState(false);
  const [hasContinue, sethasContinue] = useState(false);
  const [hasPermissonThisMonth, setHasPermissonThisMonth] = useState(true);
  const [fileExist, setfileExist] = useState(true);
  const [uploadProgress, setUploadProgress] = useState('');

  //Load the Wallet on Component Mount
  useEffect(() => {
    if (currency) {
      fetch(`/api/loadWalletByCurrency?currencyCode=${currency}`)
        .then((response) => {
          return response.json(); // Ensure response.json() is returned
        })
        .then((data) => {
          console.log('loadWalletByCurrencyResponse:', data);
          setwallets(data);
        })
        .catch((error) => {
          console.error('Error fetching wallets by currency code:', error);
        });
    }
  }, [currency]);

  //LoadSupportRegion
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

  const formFillingPerson = useContext(UserContext).username;
  const [otp, setOtp] = React.useState('');

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  let agentId = useContext(AgentContext).id;

  return (
    <>
      <MuiOtpInput
        autoFocus
        gap={1}
        length={7}
        validateChar={(text) => !isNaN(text)}
        value={otp}
        onChange={handleChange}
        onComplete={(value) => {
          setcheckInputComplete(true);
          checkPrfSubmit(
            value,
            setuserExist,
            setisChecking,
            setUserInfo,
            setHasPermissonThisMonth,
            userRole,
          );
        }}
        TextFieldsProps={{ disabled: checkInputComplete }}
      />

      {/* //if the user don't exist */}
      {!userExist && checkInputComplete && !isChecking && (
        <>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            ဒီ user မရှိပါဘူး — <strong>အရင်စာရင်းသွင်းပါ</strong>
          </Alert>
          <Stack
            spacing={2}
            direction="row"
            justifyContent={'flex-end'}
            sx={{ mt: 3, mb: 2 }}
          >
            <Button
              variant="contained"
              onClick={() => {
                setOtp('');
                setcheckInputComplete(false);
              }}
            >
              သက်တမ်းပြန်တိုးမယ်
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                location.reload(); // reload the page
              }}
            >
              အသစ်သွင်းမယ်
            </Button>
          </Stack>
        </>
      )}

      {isChecking && (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      )}
      {loading && (
        <Box sx={{ display: 'flex' }}>
          <CircularProgress />
        </Box>
      )}

      {userExist &&
        !isChecking &&
        checkInputComplete &&
        !hasPermissonThisMonth &&
        userRole != 'admin' && (
          <h1>
            ယခုလအတွင်း ဖော်ပြပါထောက်ပို့တပ်သားအတွက် စာရင်းသွင်းထားပြီးပါပြီ။
            ထူးခြားဖြစ်စဥ် ဖြစ်ပါက Admin ကိုဆက်သွယ်ပါ
          </h1>
        )}
      {/* for the admin */}
      {userExist &&
        !isChecking &&
        checkInputComplete &&
        !hasPermissonThisMonth &&
        userRole == 'admin' && (
          <>
            <h1>
              ဒီ user က ဒီလအတွက် သွင်းပြီးသွားပါပြီ။ Admin
              အနေနဲ့ဆက်ဖြည့်ချင်ပါသလား။
            </h1>
            <ExtendOrNot userInfo={userInfo} sethasContinue={sethasContinue} />
          </>
        )}

      {/* for the user */}
      {userExist &&
        !isChecking &&
        checkInputComplete &&
        hasPermissonThisMonth && (
          <ExtendOrNot userInfo={userInfo} sethasContinue={sethasContinue} />
        )}

      {userExist && !loading && hasContinue && (
        <Box
          component="form"
          onSubmit={(event) =>
            console.log('submitting ', event) ||
            extendUserSubmit(
              event,
              userInfo,
              currency,
              supportRegion,
              files,
              setloading,
              formFillingPerson,
              setAmountValidate,
              setmonthValidate,
              setmanyChatValidate,
              fileExist,
              setfileExist,
              wallets,
              agentId,
            )
          }
          sx={{ mt: 1 }}
        >
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
            defaultValue={() => setsupportRegion('choose a region')}
            getOptionLabel={(option) => option.Region || ''}
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
              onDrop={(acceptedFiles) =>
                filehandler(acceptedFiles, setfiles, files, setUploadProgress)
              }
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
          {!fileExist && (
            <p style={{ color: 'red' }}>You need to have a file</p>
          )}
          {files.length != 0 && (
            <ImageList
              sx={{ width: 500, height: 200 }}
              cols={3}
              rowHeight={164}
            >
              {files.map((item) => (
                <ImageListItem key={item.href}>
                  <img src={`${item.href}`} alt={'hello'} loading="lazy" />
                </ImageListItem>
              ))}
            </ImageList>
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
      )}
    </>
  );
};

export default ExtendUserForm;
