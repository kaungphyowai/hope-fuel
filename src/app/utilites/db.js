// Get the client
import mysql from 'mysql2/promise';

// import getDatabaseCredentials from '../secrectManager'; // Adjust the path as needed

export default async function db(query, value) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DATABASEHOST,
      user: process.env.DATABASEUSER,
      database: process.env.DATABASE,
      password: process.env.DATABASEPASSWORD,
      port: 3306,
      waitForConnections: true,
    });
    console.log('[DB] Database Connected');
    if (!connection) {
      console.log('database connection error');
    }

    let [result] = await connection.query(query, value);
    console.log('[DB] query success');
    return result;
  } catch (error) {
    console.log('[DB] query error');
    console.error(error);
  }
}
