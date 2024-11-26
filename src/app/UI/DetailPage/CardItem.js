import {
 Typography,
 Card,

} from "@mui/material";
const CardItem = ({ date, amount, currency }) => (
  <Card sx={{ width: 200, padding: 2 }}>
    <Typography>{date}</Typography>
    <Typography>
      {amount} {currency}
    </Typography>
  </Card>
);

export default CardItem;
