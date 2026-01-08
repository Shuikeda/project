import express from "express";
import http from "http";

import chatsRouter from "./routes/chats.js";
import authRouter from "./routes/auth.js";
import messagesRouter from "./routes/messages.js";

const app = express();

app.use(express.json());

// API
app.use("/api/auth", authRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/messages", messagesRouter);

// 静的ファイル
app.use(express.static("public"));
app.use(express.static("top"));
app.use(express.static("chat"));

const server = http.createServer(app);

server.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
import { pool } from "./db/db.js";

(async () => {
    try {
        const conn = await pool.getConnection();
        console.log("✅ MySQL connected");
        conn.release();
    } catch (err) {
        console.error(" MySQL connection failed:", err.message);
    }
})();
