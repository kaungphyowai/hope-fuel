import { NextResponse } from 'next/server';
import db from '../../utilites/db';
import calculateExpireDate from '../../utilites/calculateExpireDate';
import { max } from 'date-fns';


//Insert Into Customer Table
async function InsertCustomer(
  customerName,
  customerEmail,
  agentId,
  manyChatId,
  contactLink,
  month,
) {
  let currentDay = new Date();
  let nextExpireDate = calculateExpireDate(currentDay, month, true);
  const query = `
    INSERT INTO Customer (Name, Email, AgentID, ManyChatID, ContactLink, ExpireDate ) VALUES (?, ?, ?, ?, ?, ?)
    `;
  const values = [
    customerName,
    customerEmail,
    agentId,
    manyChatId,
    contactLink,
    nextExpireDate,
  ];
  try {
    const result = await db(query, values);
    // console.log("Result: ", result);
    return result.insertId; // Retrieve the inserted customer ID
  } catch (error) {
    console.error('Error inserting customer:', error);
    return NextResponse.json(
      { error: 'Failed to insert customer' },
      { status: 500 },
    );
  }
}

//Insert Into Note Table
async function createNote(note, agentID) {
  const query = `insert into Note (Note, Date, AgentID) values ( ?, ?, ?)`;
  const values = [note, new Date(), agentID];
  try {
    const result = await db(query, values);
    // console.log("Result: ", result);
    return result.insertId;
  } catch (error) {
    console.error('Error inserting customer:', error);
    return NextResponse.json(
      { error: 'Failed to insert customer' },
      { status: 500 },
    );
  }
}

//Insert Into ScreenShot Table
async function createScreenShot(screenShot, transactionsID) {
  if (!screenShot || screenShot.length === 0) {
    throw new Error('You need to provide a screenshot');
  }

  console.log(
    'From createScreenshotDB: with TransactionID :' +
      transactionsID +
      ' and  screenshot',
    JSON.stringify(screenShot),
  );

  let screenShotLink = screenShot.map(async (item) => {
    const query = `insert into ScreenShot (TransactionID , ScreenShotLink) values ( ?, ?)`;

    const path = String(item.url).substring(0, String(item.url).indexOf('?'));
    const values = [transactionsID, path];

    try {
      const result = await db(query, values);

      return result.insertId;
    } catch (error) {
      console.error('Error inserting screenshot:', error);
      throw new Error('Failed to insert screenshot');
    }
  });
  return screenShotLink;
}

//Insert Into TransactionAgent Table
async function InsertTransactionLog(transactionId, agentId) {
  const query = `INSERT INTO TransactionAgent(TransactionID, AgentID, LogDate) VALUES (?, ?, ?)`;
  const values = [transactionId, agentId, new Date()];
  try {
    const result = await db(query, values);
    console.log('result :' + result);
    return result.insertId;
  } catch (error) {
    console.error('Error inserting log', error);
    return;
  }
}

async function maxHopeFuelID() {
  const maxHopeFuelID_Query = `SELECT MAX(HopeFuelID) AS maxHopeFuelID FROM Transactions`;
  const result = await db(maxHopeFuelID_Query);

  console.log(result);
  return result[0]['maxHopeFuelID'];
}

export async function POST(req) {
  try {
    if (!req.body) {
      return NextResponse.json(
        { error: 'Request body is empty' },
        { status: 400 },
      );
    }

    const json = req.body ;

    // Destructure and validate input fields
    let {
      customerName,
      customerEmail,
      agentId,
      supportRegionId,
      manyChatId,
      contactLink,
      amount,
      month,
      note,
      walletId,
      screenShot,
    } = json;

    month = parseInt(month);

    if (!screenShot || screenShot.length === 0) {
      return NextResponse.json(
        { error: 'You need to provide a screenshot' },
        { status: 400 },
      );
    }

    if (contactLink.trim() === '') {
      contactLink = null;
    }

    let noteId = null;
    if (note && note !== '') {
      try {
        noteId = await createNote(note, agentId);
        console.log('noteId: ', noteId);
      } catch (error) {
        console.error('Error creating note:', error);
        return NextResponse.json(
          { error: 'Failed to create note' },
          { status: 500 },
        );
      }
    }

    let customerId;
    try {
      customerId = await InsertCustomer(
        customerName,
        customerEmail,
        agentId,
        manyChatId,
        contactLink,
        month,
      );
    } catch (error) {
      console.error('Error inserting customer:', error);
      return NextResponse.json(
        { error: 'Failed to insert customer' },
        { status: 500 },
      );
    }

    let nextHopeFuelID;
    try {
      nextHopeFuelID = await maxHopeFuelID();
      nextHopeFuelID = nextHopeFuelID ? nextHopeFuelID + 1 : 1;
    } catch (error) {
      console.error('Error retrieving HopeFuelID:', error);
      return NextResponse.json(
        { error: 'Failed to retrieve HopeFuelID' },
        { status: 500 },
      );
    }

    const query = `
     INSERT INTO Transactions   
    (CustomerID, Amount, SupportRegionID, WalletID, TransactionDate, NoteID, Month, HopeFuelID) 
      VALUES (?, ?, ?, ?, CONVERT_TZ(?, '+00:00', '+07:00'), ?, ?, ?)
    `;
    const values = [
      customerId,
      amount,
      supportRegionId,
      walletId,
      new Date(),
      noteId,
      month,
      nextHopeFuelID,
    ];

    let result;
    try {
      result = await db(query, values);
    } catch (error) {
      console.error('Error inserting transaction:', error);
      return NextResponse.json(
        { error: 'Failed to insert transaction' },
        { status: 500 },
      );
    }

    const transactionId = result.insertId;

    let screenShotId;
    try {
      screenShotId = await createScreenShot(screenShot, transactionId);
    } catch (error) {
      console.error('Error creating screenshot:', error);
      return NextResponse.json(
        { error: 'Failed to create screenshot' },
        { status: 500 },
      );
    }

    let logId;
    try {
      logId = await InsertTransactionLog(transactionId, agentId);
    } catch (error) {
      console.error('Error inserting transaction log:', error);
      return NextResponse.json(
        { error: 'Failed to insert transaction log' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      status: 'success',
      transactionId,
      screenShotId,
      logId,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 },
    );
  }
}
