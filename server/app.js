import express from "express";
import { pool } from "./db/db.js";
import { hashPassword, comparePassword } from "./utils/hash.js";
import { createToken } from "./utils/jwt.js";
import { authMiddleware } from "./utils/authMiddleware.js";

const app = express();
app.use(express.json());

// 動作確認用
app.get("/", (req, res) => {
    res.send("Server OK");
});

// ユーザー一覧（確認用）
app.get("/users", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT id, username, created_at FROM users"
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// ユーザー登録
app.post("/users", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "username と password は必須です" });
    }

    try {
        const hashed = await hashPassword(password);
        const [result] = await pool.query(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashed]
        );

        res.json({ success: true, userId: result.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "DB error" });
    }
});

// ログイン
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "username と password は必須です" });
    }

    try {
        const [rows] = await pool.query(
            "SELECT id, username, password FROM users WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: "ユーザーが存在しません" });
        }

        const user = rows[0];
        const ok = await comparePassword(password, user.password);

        if (!ok) {
            return res.status(401).json({ error: "パスワードが違います" });
        }

        const token = createToken({
            id: user.id,
            username: user.username
        });

        res.json({ success: true, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// ★ ログイン必須テストAPI
app.get("/me", authMiddleware, (req, res) => {
    res.json({
        id: req.user.id,
        username: req.user.username
    });
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
