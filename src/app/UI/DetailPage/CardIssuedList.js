import {
  Box,
  Typography,
  Stack,
  
  
} from "@mui/material";
import CardItem from "./CardItem";

const CardsIssuedList = () => (
  <Box sx={{ marginTop: 4 }}>
    <Typography variant="h6">List of Cards Issued</Typography>
    <Stack direction="row" spacing={2} sx={{ marginTop: 2 }}>
      <CardItem date="August 30, 2024" amount="100,000.0" currency="MMK" />
      <CardItem date="September 30, 2024" amount="100,000.0" currency="MMK" />
    </Stack>
  </Box>
);
export default CardsIssuedList;
