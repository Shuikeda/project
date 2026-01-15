
import mysql from "mysql2/promise";

export const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "pro022610e19ovject",
    database: "chat_app"
});

console.log("MySQL pool created");
