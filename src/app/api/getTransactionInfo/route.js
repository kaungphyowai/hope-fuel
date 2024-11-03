// pages/api/getTransactionInfo.js

import { NextResponse } from 'next/server';
import db from '../../utilites/db';

export async function GET(req) {
  const url = new URL(req.url);
  const customerName = url.searchParams.get('customerName');
  const customerEmail = url.searchParams.get('customerEmail');

  if (!customerName || !customerEmail) {
    return NextResponse.json(
      { error: 'Customer name and email are required' },
      { status: 400 },
    );
  }

  // Simplified query
  const query = `
   
 SELECT 
        t.TransactionID,
        c.CustomerID,
        c.Name AS CustomerName,
        c.Email AS CustomerEmail,
        t.Amount,
        w.WalletID,
        cu.CurrencyCode,
        t.ScreenShot,
        t.TransactionDate,
        n.Note
      FROM 
        Transactions t
      JOIN 
        Customer c ON t.CustomerID = c.CustomerID
      JOIN 
        Wallet w ON t.WalletID = w.WalletID
      JOIN 
        Currency cu ON w.CurrencyID = cu.CurrencyID
      LEFT JOIN 
        Note n ON t.NoteID = n.NoteID
      WHERE 
        c.Name = ? AND c.Email = ?;
  `;

  const values = [customerName, customerEmail];

  try {
    const rows = await db(query, values);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Database query error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
