import db from "../../utilites/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const HopeFuelID = searchParams.get("HopeFuelID");

  if (!HopeFuelID) {
    return NextResponse.json({ error: "Missing HopeFuelID" }, { status: 400 });
  }

  const query = `
SELECT 
    t.HopeFuelID,
    w.WalletName,
    t.Month,
    t.Amount,
    t.TransactionDate,
    cu.CurrencyCode,
    c.ManyChatId,
    sr.Region,
    n.Note,
    c.Name,
    c.Email,
    c.ExpireDate,
    c.CardID,
    a.AwsId,
    a.AgentId,
    JSON_ARRAYAGG(s.ScreenShotLink) AS ScreenShotLinks,
    ts.TransactionStatus -- Retrieve the transaction status
FROM Transactions t
JOIN Customer c ON t.CustomerID = c.CustomerId
JOIN Wallet w ON t.WalletID = w.WalletId
JOIN Currency cu ON cu.CurrencyId = w.CurrencyId
LEFT JOIN SupportRegion sr ON t.SupportRegionID = sr.SupportRegionID
LEFT JOIN Note n ON t.NoteID = n.NoteID
LEFT JOIN ScreenShot s ON t.TransactionID = s.TransactionID
LEFT JOIN Agent a ON c.AgentId = a.AgentId
LEFT JOIN FormStatus fs ON t.TransactionID = fs.TransactionID
LEFT JOIN TransactionStatus ts ON fs.TransactionStatusID = ts.TransactionStatusID
WHERE t.HopeFuelID = ?
GROUP BY 
    t.TransactionID,
    t.HopeFuelID,
    w.WalletName,
    t.Month,
    t.Amount,
    t.TransactionDate,
    cu.CurrencyCode,
    c.ManyChatId,
    sr.Region,
    n.Note,
    c.Name,
    c.Email,
    c.ExpireDate,
    c.CardID,
    a.AwsId,
    ts.TransactionStatus
  `;

  try {
    const result = await db(query, [HopeFuelID]);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function PUT(request) {
  const { HopeFuelID, Note, Status } = await request.json();

  if (!HopeFuelID) {
    return NextResponse.json({ error: "Missing HopeFuelID" }, { status: 400 });
  }

  const query = `
    UPDATE Transactions
    SET Note = ?, Status = ?
    WHERE HopeFuelID = ?;
  `;

  try {
    await db(query, [Note, Status, HopeFuelID]);
    return NextResponse.json({ message: "Updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
