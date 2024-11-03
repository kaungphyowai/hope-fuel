import db from '../utilites/db.js';

export default async function maxHopeFuelID() {
  const maxHopeFuelID_Query = `SELECT MAX(HopeFuelID) AS maxHopeFuelID FROM Transactions`;
  const result = await db(maxHopeFuelID_Query);

  console.log(result);
  return result[0]['maxHopeFuelID'];
}
