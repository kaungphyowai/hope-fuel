import { NextResponse } from 'next/server';
import db from '../../utilites/db';

async function loadSupportRegion() {
  const query = `SELECT * FROM SupportRegion`;
  try {
    const result = await db(query);
    console.log('Result for Support Region: ', result);
    return result;
  } catch (error) {
    console.error(
      "[DB] Can't show all available support regions From DB Query:",
      error,
    );
    throw error;
  }
}

export async function GET(req) {
  try {
    const data = await loadSupportRegion();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Error] Can't show all available support regions:", error);
    return NextResponse.json(
      { error: "Can't show all available support regions" },
      { status: 500 },
    );
  }
}
