// input : awsId
// output: {id: 1}

import { NextResponse } from 'next/server';
import db from '../../utilites/db';

async function createAgent(awsId, userRole) {
  const query = `
    INSERT INTO Agent (AWSID, UserRoleID) VALUES (?, ?);

  `;

  const values = [awsId, userRole];
  console.log('This is the value that you wanted: ');
  console.log(values);
  try {
    const result = await db(query, values);
    console.log('Agent created:', result);
    return result.insertId; //return AgentId
  } catch (error) {
    console.error('[DB] Error creating agent in DB:', error);
    throw error;
  }
}

export async function POST(req) {
  try {
    const { awsId } = await req.json();

    const data = await createAgent(awsId, 1);

    return NextResponse.json({ id: data });
  } catch (error) {
    console.error('[Error] Cannot create agentUser', error);
    return NextResponse.json(
      { error: 'Cannot create agentUser' },
      { status: 500 },
    );
  }
}
