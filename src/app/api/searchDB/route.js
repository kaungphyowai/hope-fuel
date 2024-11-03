import { NextResponse } from 'next/server';
import db from '../../../app/utilites/db';

// Query to fetch data for the card view
async function DataForCard() {
  const query = `
    SELECT 
        C.CurrencyCode,
        Cu.Name AS CustomerName,
        T.HopeFuelID,
        S.ScreenShotLink
    FROM 
        Transactions T
    JOIN 
        Customer Cu ON T.CustomerID = Cu.CustomerId
    JOIN 
        Wallet W ON T.WalletID = W.WalletId
    JOIN 
        Currency C ON W.CurrencyId = C.CurrencyId
    JOIN 
        ScreenShot S ON S.TransactionID = T.TransactionID
    WHERE
        MONTH(T.TransactionDate) = 10 
        AND YEAR(T.TransactionDate) = YEAR(CURDATE());
  `;
  try {
    const result = await db(query); // Use correct db method (e.g., query or execute)
    console.log('Card Data:', result);
    return result;
  } catch (error) {
    console.error('Error fetching card data:', error);
    throw new Error('Error fetching card data');
  }
}

// Query to fetch data based on search input
async function searchBoxQuery(HopeFuelID) {
  const query = `
    SELECT 
        C.CurrencyCode,
        Cu.Name AS CustomerName,
        T.HopeFuelID,
        S.ScreenShotLink
    FROM 
        Transactions T
    JOIN 
        Customer Cu ON T.CustomerID = Cu.CustomerId
    JOIN 
        Wallet W ON T.WalletID = W.WalletId
    JOIN 
        Currency C ON W.CurrencyId = C.CurrencyId
    JOIN 
        ScreenShot S ON S.TransactionID = T.TransactionID
    WHERE
        MONTH(T.TransactionDate) = 10 
        AND YEAR(T.TransactionDate) = YEAR(CURDATE())
        AND T.HopeFuelID = ?;  -- Use placeholder for safe query execution
  `;

  try {
    const result = await db(query, [HopeFuelID]); // Use parameterized query
    return result;
  } catch (error) {
    console.error('Error fetching search box data:', error);
    throw new Error('Error fetching search box data');
  }
}

// Handle GET requests to the /api/searchDB endpoint
export async function GET(req) {
  const { searchParams } = new URL(req.url); // Extract query params from request
  const HopeFuelID = searchParams.get('HopeFuelID');

  try {
    let data;
    if (HopeFuelID) {
      data = await searchBoxQuery(HopeFuelID); // Fetch data based on search input
    } else {
      data = await DataForCard(); // Fetch default card data
    }

    return NextResponse.json(data); // Return the data as JSON response
  } catch (error) {
    console.error('[Error] Cannot get card data:', error);
    return NextResponse.json(
      { error: 'Cannot get card data' },
      { status: 500 },
    );
  }
}
