document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("createChatForm");
    const message = document.getElementById("message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const chatName = document.getElementById("chatName").value;

        // PHPに送信
        const res = await fetch("chat_create.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `chatName=${encodeURIComponent(chatName)}`
        });

        const text = await res.text();

        if (text === "OK") {
            message.textContent = "チャットを作成しました。TOPに戻ります…";
            setTimeout(() => {
                window.location.href = "top.html";
            }, 1200);
        } else {
            message.textContent = "エラー: " + text;
        }
    });
});
