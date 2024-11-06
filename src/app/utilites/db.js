import mysql from 'mysql2/promise';
require('dotenv').config({ path: '.env.local' });

export default async function db(query, value) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DATABASEHOST,
      user: process.env.DATABASEUSER,
      database: process.env.DATABASE,
      password: process.env.DATABASEPASSWORD,
      port: 3306,
      waitForConnections: true,
    });
    console.log('[DB] Database Connected');
    console.log('Database Config:', {
      host: process.env.DATABASEHOST,
      user: process.env.DATABASEUSER,
      password: process.env.DATABASEPASSWORD,
      database: process.env.DATABASE,
    });

    const [result] = await connection.execute(query, value);
    console.log('[DB] query success');
    return result;
  } catch (error) {
    console.log('[DB] query error');
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('[DB] Connection closed');
    }
  }
}
