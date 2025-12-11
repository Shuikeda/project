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
