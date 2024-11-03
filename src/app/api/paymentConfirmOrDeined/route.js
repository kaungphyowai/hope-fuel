import { NextResponse } from 'next/server';
import db from '../../utilites/db';

//Get Transactions Dashboard Data
export async function POST(req) {
  try {
    let json = await req.json();
    console.log('RequestBody from Confirm payment:', json);
    let deined = json.denied;
    let transactionId = json.HopeFuelID;
    const sql = `UPDATE Transactions SET PaymentDenied = ?,PaymentCheck = 1, PaymentCheckTime = ?  WHERE HopeFuelID = ?;`;
    const value = [deined, new Date(), transactionId];
    let result = await db(sql, value);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Error] Cannot get dashboard data', error);
    return NextResponse.json(
      { error: 'Cannot get dashboard data ' },
      { status: 500 },
    );
  }
}
