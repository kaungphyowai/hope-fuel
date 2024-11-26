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
const UserInfo = ({user}) => (
  <Stack spacing={1}>
    <Typography variant="h6">{user.Name}</Typography>
    <Typography>Email: {user.email}</Typography>
    <Stack direction="row" spacing={2}>
      <Typography>Expire Date: {user.ExpireDate}</Typography>
      <Typography>Card No: {user.CardID}</Typography>
    </Stack>
  </Stack>
);
export default UserInfo;
