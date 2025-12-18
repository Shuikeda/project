import express from "express";
import { pool } from "../db/db.js";
import { authMiddleware as auth } from "../utils/authMiddleware.js";

const router = express.Router();

// メッセージ一覧取得
router.get("/:chatId", auth, async (req, res) => {
    const chatId = req.params.chatId;

    try {
        const [rows] = await pool.query(
            `
            SELECT m.content, u.username, m.created_at
            FROM messages m
            JOIN users u ON m.user_id = u.id
            WHERE m.chat_id = ?
            ORDER BY m.created_at ASC
            `,
            [chatId]
        );

        res.json({ messages: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "failed to load messages" });
    }
});

export default router;
