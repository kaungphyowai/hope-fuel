import { NextResponse } from "next/server";
import db from "../../utilites/db";

// Handle POST request to update payment status
export async function POST(req) {
  try {
    const json = await req.json();
    console.log("RequestBody from Confirm payment:", json);

    const denied = json.denied;
    const transactionId = json.HopeFuelID;
    const note = json.note ; 
    const formStatus = json.formStatus; 
    const agentId = json.AgentId;

    
    // SQL queries
    const updateTransactionQuery = `
      UPDATE Transactions 
      SET PaymentDenied = ?, PaymentCheck = 1, PaymentCheckTime = ? 
      WHERE HopeFuelID = ?;
    `;

    const updateNoteQuery = `
      UPDATE Note 
      SET Note = ?, Date = ?, AgentID = ? 
      WHERE NoteID = (
        SELECT NoteID FROM Transactions WHERE HopeFuelID = ?
      );
    `;

    const updateFormStatusQuery = `
      UPDATE FormStatus
      SET TransactionStatusID = ?
      WHERE TransactionID = (
          SELECT TransactionID
          FROM Transactions
          WHERE HopeFuelID = ?
          LIMIT 1
      );
    `;

    // Values for each query
    const transactionValues = [denied, new Date(), transactionId];
    const noteValues = [note, new Date(), agentId , transactionId]; 
    const formStatusValues = [formStatus, transactionId];

    // Execute queries sequentially
    const transactionResult = await db(
      updateTransactionQuery,
      transactionValues
    );
    const noteResult = await db(updateNoteQuery, noteValues);
    const formStatusResult = await db(updateFormStatusQuery, formStatusValues);

    // Return success response
    return NextResponse.json({
      message: "Payment status updated successfully",
      transactionResult,
      noteResult,
      formStatusResult,
    });
  } catch (error) {
    console.error("[Error] Failed to update payment status:", error);
    return NextResponse.json(
      { error: "Failed to update payment status" },
      { status: 500 }
    );
  }
}
