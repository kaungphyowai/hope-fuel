export const dynamic = 'force-dynamic'; // defaults to force-static
import db from '../../utilites/db';
import calculateExpireDate from '../../utilites/calculateExpireDate';
import recentExpireDate from '../../utilites/recentExpireDate.js';
import maxHopeFuelID from '../../utilites/maxHopeFuelID.js';
async function createScreenShot(screenShot, transactionsID) {
  console.log(transactionsID + '  ' + screenShot);

  let screenShotLink = await screenShot.map(async (item) => {
    const query = `insert into ScreenShot (TransactionID , ScreenShotLink) values ( ?, ?)`;

    const path = String(item.url).substring(0, String(item.url).indexOf('?'));
    const values = [transactionsID, path];

    try {
      const result = await db(query, values);
      console.log('result ' + result);
      // console.log("Result: ", result);
      return result.insertId;
    } catch (error) {
      console.error('Error inserting ScreenShot:', error);
      return;
    }
  });
  return screenShotLink;
  // return screenShotLink;
}

export async function POST(request) {
  //get customer ID based on the PRF no

  const obj = await request.json();
  console.log('Obj from extendUserAPI: ', obj);

  if (!obj['screenShot']) {
    return NextResponse.json(
      { error: 'You need to provide a screenshot' },
      { status: 400 },
    );
  }

  let [result] = await db(
    'Select ExpireDate from Customer where CustomerID=?',
    [obj['customerId']],
  );
  console.log('Result is ' + result);
  let nextExpireDate = null;

  if (result['ExpireDate']) {
    let currentExpireDate = new Date(result['ExpireDate']);

    let lastDayOfthisMonth = calculateExpireDate(new Date(), 0, 0);
    let isEedCurrent =
      currentExpireDate.getFullYear() >= lastDayOfthisMonth.getFullYear() &&
      currentExpireDate.getMonth() >= lastDayOfthisMonth.getMonth();
    if (isEedCurrent) {
      nextExpireDate = calculateExpireDate(
        currentExpireDate,
        parseInt(obj['month']),
        !isEedCurrent,
      );
    } else {
      nextExpireDate = calculateExpireDate(
        new Date(),
        parseInt(obj['month']),
        !isEedCurrent,
      );
    }
  } else {
    // return Response.error("Cannot find ExpireDate")
  }

  let nextHopeFuelID = await maxHopeFuelID();
  console.log('nextHopeFuelID', nextHopeFuelID);

  if (nextHopeFuelID === null) {
    nextHopeFuelID = 0;
  }
  nextHopeFuelID++;
  console.log('Incremented maxHopeFuelID:', nextHopeFuelID);
  let now = Date.now();
  const rows = await db(
    'INSERT INTO Transactions (CustomerID, SupportRegionID, WalletID, Amount, PaymentCheck, PaymentCheckTime, NoteID, TransactionDate, PaymentDenied, Month, HopeFuelID) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? )',
    [
      obj['customerId'],
      obj['supportRegionId'],
      obj['walletId'],
      parseInt(obj['amount']),
      false,
      null,
      obj['noteId'],
      new Date(),
      false,
      obj['month'],
      nextHopeFuelID,
    ],
  );
  const transactionId = rows.insertId;

  // //update the expire date
  const value = [nextExpireDate, obj['customerId']];

  const sql = `UPDATE Customer SET ExpireDate = ? WHERE CustomerID = ? LIMIT 1`;
  try {
    let result = await db(sql, value);
    // console.log("Result: ", result);
    console.log('Transaction ID is ' + transactionId);
    await db(
      `INSERT INTO TransactionAgent (
          TransactionID, AgentID, LogDate
      ) VALUES (?, ?, ?)`,
      [transactionId, obj['agentId'], new Date()],
    );
    // add the transaction id and agentid in the same one

    const screenShotIds = await createScreenShot(
      obj['screenShot'],
      transactionId,
    );
    return Response.json(result);
  } catch (error) {
    console.error('Error inserting customer:', error);
    return NextResponse.json(
      { error: 'Failed to insert customer' },
      { status: 500 },
    );
  }
}
