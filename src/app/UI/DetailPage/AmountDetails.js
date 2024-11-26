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
const AmountDetails = () => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Chip label="MMK" color="error" />
    <Typography variant="h5">Total Amount</Typography>
    <Typography variant="h4" color="primary">
      100,000.0
    </Typography>
    <Typography variant="h5">Total Month</Typography>
    <Typography variant="h4" color="primary">
      1
    </Typography>
  </Stack>
);
export default AmountDetails;
