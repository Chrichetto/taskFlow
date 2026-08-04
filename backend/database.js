import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

const database = new Pool({
    connectionString: process.env.DATABASE_URL
});

database.on("error", errore => {
    console.error("Errore inatteso nella connessione PostgreSQL:", errore);
});

export default database;