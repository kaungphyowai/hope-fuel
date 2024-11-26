export default async function checkUserSubmit(name, email, userRole) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  };

  try {
    // Check if user exists in Airtable
    const response = await fetch("/api/checkUser", requestOptions);
    const result = await response.json();
    if (result.message) {
      return {
        name,
        email,
        prf_no: result.prf_no,
        expire_date: result.expire_date[0],
      };
    }

    // Check if user exists in MySQL
    const mysqlResponse = await fetch("/api/InCustomerTable", requestOptions);
    const mysqlResult = await mysqlResponse.json();
    if (mysqlResult.Name) {
      return {
        name,
        email,
        prf_no: mysqlResult.CardID,
        expire_date: mysqlResult.ExpireDate,
      };
    }

    return null; // New user
  } catch (error) {
    console.error("Error checking user:", error);
    return null;
  }
}
