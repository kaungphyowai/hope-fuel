export const dynamic = "force-dynamic"; // defaults to force-static
import db from "../../utilites/db";

// Function to insert a note
async function insertNote(note, agentID) {
  const query = `INSERT INTO Note (Note, Date, AgentID) VALUES (?, ?, ?)`;
  const values = [note, new Date(), agentID];

  try {
    const result = await db(query, values);
    return result.insertId; // Return the inserted note ID
  } catch (error) {
    console.error("Error inserting note:", error);
    throw new Error("Failed to insert note");
  }
}


// POST request handler
export async function POST(req) {
  try {
    const { note, agentID } = await req.json();
    const insertId = await insertNote(note, agentID); // Use the insertNote function

    return Response.json({ id: insertId });
  } catch (error) {
    console.error("Error in POST request:", error);
    return Response.json({ error: "Failed to insert note" }, { status: 500 });
  }
}
