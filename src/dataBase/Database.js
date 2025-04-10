import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const { Pool } = pg;
export const poolDatabase = new Pool({
  connectionString: process.env.DATABASE_PUBLIC_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});
poolDatabase.connect()
.then(() => {console.log('Conexión a la base de datos establecida correctamente');})
.catch((err) => {
  console.error('Error al conectar a la base de datos:', err);
});
poolDatabase.query('SELECT NOW()')