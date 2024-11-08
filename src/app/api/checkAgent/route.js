import { NextResponse } from 'next/server';
import db from '../../utilites/db';

async function checkExistedAgent(awsId) {
  const query = `
  SELECT 
    (
      SELECT 1
      FROM Agent
      WHERE AWSID = ?
    ) AS AgentExists,
    a.AgentID, 
    a.AWSID, 
    a.UserRoleID, 
    ur.UserRole
  FROM Agent a
  JOIN UserRole ur ON a.UserRoleID = ur.UserRoleID
  WHERE a.AWSID = ?;
  `;

  const values = [awsId, awsId];
  try {
    const result = await db(query, values);
    return result;
  } catch (error) {
    console.error('[DB] Error checking agentDB:', error);
    throw error;
  }
}

export async function GET(req) {
  try {
    let url;

    // Check if req.url is a fully qualified URL
    if (req.url.startsWith('http')) {
      url = new URL(req.url);
    } else {
      // Prepend a base URL if it's a relative URL
      url = new URL(req.url, 'http://localhost');
    }

    const awsId = url.searchParams.get('awsId');

    // Handle missing awsId parameter
    if (!awsId) {
      return NextResponse.json(
        { error: 'Missing awsId query parameter' },
        { status: 400 },
      );
    }

    const data = await checkExistedAgent(awsId);

    if (data.length === 0 || data[0].AgentExists === 0) {
      return NextResponse.json(
        { message: 'User does not exist', code: 0 },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        message: 'User exists',
        code: 1,
        user: data[0],
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('[Error] Cannot load existing agentUser', error);
    return NextResponse.json(
      { error: 'Cannot load existing agentUser' },
      { status: 500 },
    );
  }
}
