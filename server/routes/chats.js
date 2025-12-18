import express from "express";
import { pool } from "../db/db.js";
import { authMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// -----------------------------
// チャット一覧取得
// -----------------------------
router.get("/", authMiddleware, async (req, res) => {
    const userId = req.user.id;

    try {
        const [rows] = await pool.query(
            `SELECT c.id, c.name
             FROM chats AS c
             JOIN chat_members AS m ON c.id = m.chat_id
             WHERE m.user_id = ?`,
            [userId]
        );

        res.json({ chats: rows });

    } catch (err) {
        console.error("Chat list error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;

// -------------------------
// チャット作成 API
// -------------------------
router.post("/create", auth, (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;

    if (!name) {
        return res.status(400).json({ success: false, message: "チャット名が必要です" });
    }

    // チャット作成
    const chatInsert = db.prepare(
        "INSERT INTO chats (name, owner_id) VALUES (?, ?)"
    );
    const result = chatInsert.run(name, userId);

    const chatId = result.lastInsertRowid;

    // チャット作成者をメンバー登録（owner）
    const memberInsert = db.prepare(
        "INSERT INTO chat_members (chat_id, user_id, role) VALUES (?, ?, 'owner')"
    );
    memberInsert.run(chatId, userId);

    res.json({
        success: true,
        chatId,
        message: "チャットを作成しました"
    });
});

async function getUserRole(chatId, userId) {
    const row = await db.get(
        "SELECT role FROM chat_members WHERE chat_id=? AND user_id=?",
        [chatId, userId]
    );
    return row ? row.role : null;
}

