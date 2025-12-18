document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("createChatForm");
    if (!form) return;

    const message = document.getElementById("message");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const chatName = document.getElementById("chatName").value;

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
            message.textContent = "チャットを作成しました";
            setTimeout(() => {
                location.href = "/top/top.html";
            }, 1200);
        } else {
            message.textContent = data.error;
        }
    });
});
