import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";

export function setupChatWebSocket(server) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws, req) => {
        const token = new URL(req.url, "http://localhost")
            .searchParams.get("token");

        if (!token) return ws.close();

        let user;
        try {
            user = jwt.verify(token, "SECRET_KEY");
        } catch {
            return ws.close();
        }

        ws.on("message", async (msg) => {
            const data = JSON.parse(msg);
            const { chatId, content } = data;

            // DB 保存
            await pool.query(
                "INSERT INTO messages (chat_id, user_id, content) VALUES (?, ?, ?)",
                [chatId, user.id, content]
            );

            // 全員に配信
            wss.clients.forEach(client => {
                if (client.readyState === 1) {
                    client.send(JSON.stringify({
                        username: user.username,
                        content,
                        created_at: new Date()
                    }));
                }
            });
        });
    });
}
