import React from 'react';
import { Stack } from '@mui/material';
import ItemCard from './ItemCard';

function ItemList({ items }) {
  return (
    <Stack spacing={2}>
      {items.map((item, index) => (
        <ItemCard key={index} item={item} />
      ))}
    </Stack>
  );
}

export default ItemList;
