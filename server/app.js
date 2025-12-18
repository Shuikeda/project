import express from "express";
import chatsRouter from "./routes/chats.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(express.json());

// API エンドポイント
app.use("/api/chats", chatsRouter);

// 公開フォルダ（HTML/CSS/JS ファイルを置く場所）
app.use(express.static("public"));
app.use(express.static("top"));
app.use(express.static("chat"));

app.listen(3000, () => console.log("Server running on port 3000"));

app.use(express.json());
app.use("/api/auth", authRouter);

const chatsRoute = require("./server/routes/chats");
app.use("/api/chats", chatsRoute);

import messagesRouter from "./server/routes/messages.js";
app.use("/api/messages", messagesRouter);

import http from "http";
import { setupChatWebSocket } from "./server/websocket/chat.js";

const server = http.createServer(app);
setupChatWebSocket(server);

server.listen(3000, () => {
    console.log("Server running on port 3000");
});
async function getUserRole(chatId, userId) {
    const row = await db.get(
        "SELECT role FROM chat_members WHERE chat_id=? AND user_id=?",
        [chatId, userId]
    );
    return row ? row.role : null;
}
app.post("/api/chats/:id/set-admin", authMiddleware, async (req, res) => {
    const chatId = req.params.id;
    const { userId } = req.body;

    const myRole = await getUserRole(chatId, req.user.id);
    if (myRole !== "owner") {
        return res.json({ success: false, error: "権限がありません" });
    }

    await db.run(
        "UPDATE chat_members SET role='admin' WHERE chat_id=? AND user_id=?",
        [chatId, userId]
    );

    res.json({ success: true });
});

app.post("/api/chats/:id/remove-admin", authMiddleware, async (req, res) => {
    const chatId = req.params.id;
    const { userId } = req.body;

    const myRole = await getUserRole(chatId, req.user.id);
    if (myRole !== "owner") {
        return res.json({ success: false, error: "権限がありません" });
    }

    await db.run(
        "UPDATE chat_members SET role='member' WHERE chat_id=? AND user_id=?",
        [chatId, userId]
    );

    res.json({ success: true });
});

app.get("/api/chats/:id/members", authMiddleware, async (req, res) => {
    const chatId = req.params.id;

    const members = await db.all(`
        SELECT users.id, users.username, chat_members.role
        FROM chat_members
        JOIN users ON users.id = chat_members.user_id
        WHERE chat_members.chat_id=?
    `, [chatId]);

    res.json({ members });
});
