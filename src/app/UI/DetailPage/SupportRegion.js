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
const SupportRegion = () => (
  <Stack direction="row" alignItems="center" spacing={2}>
    <Typography>Support Region:</Typography>
    <Chip label="Region 1" color="error" />
  </Stack>
);
export default SupportRegion;
