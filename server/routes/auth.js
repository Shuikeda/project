import express from "express";
import jwt from "jsonwebtoken";
import { pool } from "../db/db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

const router = express.Router();

// ----------------------------------
// 新規登録
// ----------------------------------
router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashed = await hashPassword(password);

        await pool.query(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, hashed]
        );

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Registration error" });
    }
});

// ----------------------------------
// ログイン（JWT 発行）
// ----------------------------------
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return res.status(400).json({ error: "User not found" });
        }

        const user = rows[0];

        const match = await comparePassword(password, user.password);

        if (!match) {
            return res.status(400).json({ error: "Wrong password" });
        }

        // JWT 発行
        const token = jwt.sign(
            { id: user.id, username: user.username },
            "SECRET_KEY",
            { expiresIn: "7d" }
        );

        res.json({ token });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Login error" });
    }
});

export default router;
