import mysql from "mysql2/promise.js";

const database = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "tasks"
});

export default database;