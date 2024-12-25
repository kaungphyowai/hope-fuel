import { NextResponse } from "next/server";
import db from "../../utilites/db";

// Handle POST request to update payment status
export async function POST(req) {
  try {
    const json = await req.json();
    const note = json.note;
    const noteId = json.noteId;

    const updateNoteQuery = `
      UPDATE Note 
      SET Note = ?
      WHERE NoteID = ?
    `;

    // Values for each query
    const noteValues = [note, noteId];

    const noteResult = await db(updateNoteQuery, noteValues);

    // Return success response
    return NextResponse.json({
      message: "Note updated successfully",
      noteResult,
    });
  } catch (error) {
    console.error("[Error] Failed to update note: ", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}
