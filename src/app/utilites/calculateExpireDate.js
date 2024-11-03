export default function calculateExpireDate(
  currentExpireDate,
  month,
  hasExpired,
) {
  // we will assume that currentExpireDate will be always at the end of the month
  console.log(currentExpireDate.getFullYear());
  console.log(currentExpireDate.getMonth());
  console.log(month);
  if (hasExpired) {
    return new Date(
      currentExpireDate.getFullYear(),
      currentExpireDate.getMonth() + month,
      0,
    );
  } else {
    return new Date(
      currentExpireDate.getFullYear(),
      currentExpireDate.getMonth() + month + 1,
      0,
    );
  }
}
