import { NextResponse } from "next/server";
import db from "../../utilites/db";


async function  InsertCustomer(customerName, customerEmail, AgentID,ManyChatID, Contactlink,Amount,Month)
{
    const query = `
    INSERT INTO Customer (Name, Email, AgentID, ManyChatID, ContactLink) VALUES (?, ?, ?, ?, ?)
    `;
    const values = [customerName, customerEmail, AgentID, ManyChatID, Contactlink];
       try {
      const result = await db(query, values);
     // console.log("Result: ", result);
       return  result.insertId; // Retrieve the inserted customer ID
    } catch (error) {
      console.error("Error inserting customer:", error);
      return NextResponse.json(
        { error: "Failed to insert customer" },
        { status: 500 }
      );
    }
    
}
async function createNote(note,agentID) {
  const query = `insert into Note (Note,Date,AgentID) values ( ?, ?, ?)`;
  const values = [ note, new Date(), agentID];
  try {
    const result = await db(query, values);
   // console.log("Result: ", result);
    return result.insertId;
  } catch (error) {
    console.error("Error inserting customer:", error);
    return NextResponse.json(
      { error: "Failed to insert customer" },
      { status: 500 }
    );
  }
}
export async function POST(req){
    try{
      let json = await req.json();

      const { customerName, customerEmail, agentID, supportRegionID, 
        manyChatID, contactLink, amount, month ,note,walletId} = json;
      
       const customerId = await InsertCustomer(customerName, customerEmail, agentID, manyChatID, contactLink, amount, month);
       // console.log("customerId: ",customerId);
        
        const noteId = await createNote(note,agentID);
       //  console.log("noteId: ",noteId);

    const query = `
      INSERT INTO Transactions 
      (CustomerID, Amount,AgentID,SupportRegionID, WalletID, ScreenShot, TransactionDate, NoteID) 
      VALUES (?, ?, ?, ?, ?, ?, ?,?)
    `;
    const values= [customerId, amount, agentID,supportRegionID,  walletId, null, "2024-07-13",noteId];
     const result = await db(query, values);
    // console.log("Result: ", result);
 return Response.json({status: "success"});

    }catch(error)
    {console.log("[DB] query error");}
}