document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("createChatForm");
    if (!form) return;

    const message = document.getElementById("message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const chatName = document.getElementById("chatName").value.trim();
        if (!chatName) return;

        const res = await fetch("/api/chats", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({ name: chatName })
        });

        const data = await res.json();

        if (data.success) {
            message.textContent = "チャットを作成しました。移動します…";
            setTimeout(() => {
                location.href = `/chat/chat.html?id=${data.chatId}`;
            }, 800);
        } else {
            message.textContent = data.error || "作成に失敗しました";
        }
    });
});
