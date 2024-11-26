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

const ActionButtons = () => (
  <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
    <Button variant="contained" color="error" sx={{ width: "150px" }}>
      Confirm
    </Button>
    <Button variant="outlined" color="error" sx={{ width: "150px" }}>
      Deny
    </Button>
  </Stack>
);
export default ActionButtons;
