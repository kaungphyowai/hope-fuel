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
  // Format the TransactionDate
  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      month: "long", // Full month name
      day: "numeric", // Day of the month
      year: "numeric", // Full year
      hour: "2-digit", // Hour in 24-hour format
      minute: "2-digit", // Minute
      hour12: false, // Use 24-hour format
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  }
const UserInfo = ({user}) => (
  
  <Stack spacing={1}>
    <Typography variant="h6">{user.Name}</Typography>
    <Typography>Email: {user.Email}</Typography>
    <Stack direction="row" spacing={2}>
      <Typography>Expire Date: {formatDate(user.ExpireDate)}</Typography>
      <Typography>Card No: {user.CardID}</Typography>
    </Stack>
  </Stack>
);
export default UserInfo;
