import express from "express";
import { authMiddleware } from "../utils/authMiddleware.js";

const router = express.Router();

// -----------------------------
// チャット一覧取得（ダミー）
// -----------------------------
router.get("/", authMiddleware, async (req, res) => {
    res.json({
        chats: []
    });
});

// -----------------------------
// チャット作成（ダミー）
// -----------------------------
router.post("/", authMiddleware, async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            success: false,
            error: "チャット名が必要です"
        });
    }

    res.json({
        success: true,
        chatId: 1,
        message: "（ダミー）チャットを作成しました"
    });
});

export default router;
