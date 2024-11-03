import { NextResponse } from 'next/server';
import db from '../../utilites/db';

async function loadWallet(currencyCode) {
  const query = `
  SELECT Wallet.WalletID, Wallet.WalletName 
  FROM Wallet 
  JOIN Currency ON Wallet.CurrencyID = Currency.CurrencyID 
  WHERE Currency.CurrencyCode = ?
`;
  const values = [currencyCode];
  try {
    const result = await db(query, values);
    console.log('Result for available wallet for currency ', result);
    return result;
  } catch (error) {
    console.error(
      "[DB] Can't show all available wallet for currency From DB Query:",
      error,
    );
    throw error;
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const currencyCode = url.searchParams.get('currencyCode');
    const data = await loadWallet(currencyCode);
    if (data.length === 0) {
      return NextResponse.json(
        { message: `No wallets found for currency code: ${currencyCode}` },
        { status: 404 },
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('[Error] Cannot load existing wallet', error);
    return NextResponse.json(
      { error: 'Cannot load existing wallet' },
      { status: 500 },
    );
  }
}
