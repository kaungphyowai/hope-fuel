export default function recentExpireDate(transactionDate, databaseExpireDate) {
  // check which is bigger, airtable ExpireDate or transaction add date
  let date =
    databaseExpireDate < transactionDate ? transactionDate : databaseExpireDate;
  return date;
}
