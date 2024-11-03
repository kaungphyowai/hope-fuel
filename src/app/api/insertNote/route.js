export const dynamic = 'force-dynamic'; // defaults to force-static
import db from '../../utilites/db';

export async function POST(req) {
  const query = `insert into Note (Note,Date,AgentID) values ( ?, ?, ?)`;
  const { note, agentID } = await req.json();
  const values = [note, new Date(), agentID];
  try {
    const result = await db(query, values);
    // console.log("Result: ", result);
    return Response.json({
      id: result.insertId,
    });
  } catch (error) {
    console.error('Error inserting customer:', error);
    return Response.json({ error: 'Failed to insert note' }, { status: 500 });
  }
}
