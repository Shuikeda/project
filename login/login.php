<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $username = trim($_POST["username"]);

    if ($username === "") {
        header("Location: login.html?error=1");
        exit();
    }

    // ログイン成功｜セッション保持
    $_SESSION["user"] = $username;

    // アカウントページへ
    header("Location: account.html");
    exit();
}
?>
