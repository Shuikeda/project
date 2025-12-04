<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = trim($_POST["login-name"]);

    if ($name === "") {
        header("Location: login.html?error=1");
        exit();
    }

    // ログイン成功
    $_SESSION["user"] = $name;
    header("Location: account.html");
    exit();
}
?>
