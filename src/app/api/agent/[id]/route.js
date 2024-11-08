import { NextResponse } from 'next/server';
import db from '../../../utilites/db';

async function checkExistedAgent(awsId) {
  const query = `
    SELECT EXISTS (
      SELECT 1
      FROM Agent
      WHERE AWSID = ?
    ) AS AgentExists;
  `;

  const values = [awsId];
  try {
    const result = await db(query, values);
    console.log('Agent exists:', result);
    return result;
  } catch (error) {
    console.error('[DB] Error checking agentDB:', error);
    throw error;
  }
}

//Get the agentInfo
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const awsId = url.searchParams.get('awsId');

    if (!awsId) {
      return NextResponse.json(
        { error: 'Missing awsId query parameter' },
        { status: 400 },
      );
    }

    const data = await checkExistedAgent(awsId);
    //console.log("Data:", data); // Log the entire data array

    if (data.length === 0 || data[0].AgentExists === 0) {
      return NextResponse.json(
        { message: 'User does not exist', code: 0 },
        { status: 404 },
      );
    }
    return NextResponse.json({ message: 'User exists', code: 1 });
  } catch (error) {
    console.error('[Error] Cannot load existing agentUser', error);
    return NextResponse.json(
      { error: 'Cannot load existing agentUser' },
      { status: 500 },
    );
  }
}

// input : awsId
// output: {id: 1}

async function createAgent(awsId, userRole) {
  const query = `
    INSERT INTO Agent (AWSID, UserRoleID) VALUES (?, ?);

  `;

  const values = [awsId, userRole];
  try {
    const result = await db(query, values);
    console.log('Agent created:', result);
    return result.insertId; //return AgentId
  } catch (error) {
    console.error('[DB] Error creating agent in DB:', error);
    throw error;
  }
}

//Crete a New Agent
export async function POST(req) {
  try {
    const { awsId } = await req.json();
    const data = await createAgent(awsId, 1); //userrole 1 is support agent

    return NextResponse.json({ id: data });
  } catch (error) {
    console.error('[Error] Cannot create agentUser', error);
    return NextResponse.json(
      { error: 'Cannot create agentUser' },
      { status: 500 },
    );
  }
}
