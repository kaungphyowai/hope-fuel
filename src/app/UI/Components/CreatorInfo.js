import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
const CreatorInfo = ({creator}) => {
    if (!creator) return <p>No data available in AmountDetails</p>;

return (
  <Stack spacing={1}>
    <Typography>Created by {creator.AwsId}</Typography>
    <Typography>Mg Mg </Typography>
    <Typography>HOPEID: {creator.HopeFuelID}</Typography>
    <Typography>Manychat ID: {creator.ManyChatId}</Typography>
  </Stack>
);

};
export default CreatorInfo;
