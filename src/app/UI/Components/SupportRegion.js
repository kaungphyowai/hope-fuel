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
const SupportRegion = ({region}) => {
    if (!region) return <p>No data available in AmountDetails</p>;

    return (
  <Stack direction="row" alignItems="center" spacing={2}>
    <Typography>Support Region:</Typography>
    <Chip label={region.Region} color="error" />
  </Stack>)
};
export default SupportRegion;
