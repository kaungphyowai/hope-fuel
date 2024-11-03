import React from 'react';
import { Card, CardContent, Typography, Chip, Box } from '@mui/material';

function ItemCard({ item }) {
  return (
    <Card
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px',
        boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.2)',
        '&:hover': { backgroundColor: '#f0f0f0' },
        cursor: 'pointer',
      }}
    >
      <Box
        component="img"
        src={item.ScreenShotLink} // Replace with dynamic image URL if available
        alt="Customer Image"
        sx={{
          width: 64,
          height: 64,
          marginRight: '16px',
          borderRadius: '8px',
          objectFit: 'cover',
          backgroundColor: '#c4c4c4',
        }}
      />
      <div
        sx={{
          display: 'block',
        }}
      >
        <CardContent sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            HOPEID - {item.HopeFuelID}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {item.CustomerName}
          </Typography>
        </CardContent>
        <Box>
          <Chip
            label={item.CurrencyCode}
            sx={{
              backgroundColor: '#fecaca',
              color: 'black',
            }}
          />
        </Box>
      </div>
    </Card>
  );
}

export default ItemCard;
