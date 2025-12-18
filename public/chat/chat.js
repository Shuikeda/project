document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(location.search);
    const chatId = params.get("id");
    if (!chatId) return;

    const token = localStorage.getItem("token");
    const messagesDiv = document.getElementById("messages");
    const input = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");

    // 過去メッセージ
    fetch(`/api/messages/${chatId}`, {
        headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {
        data.messages.forEach(addMessage);
    });

    // WebSocket
    const ws = new WebSocket(`ws://localhost:3000?token=${token}`);

    ws.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        addMessage(msg);
    };

    sendBtn.onclick = () => {
        if (!input.value) return;

        ws.send(JSON.stringify({
            chatId,
            content: input.value
        }));

        input.value = "";
    };

    function addMessage(msg) {
        const div = document.createElement("div");
        div.textContent = `${msg.username}: ${msg.content}`;
        messagesDiv.appendChild(div);
    }
});

fetch(`/api/chats/${chatId}/members`, {
    headers: { Authorization: "Bearer " + token }
})
.then(res => res.json())
.then(data => {
    const panel = document.getElementById("member-panel");

    data.members.forEach(m => {
        const div = document.createElement("div");
        div.textContent = `${m.username} (${m.role})`;

        if (myRole === "owner" && m.role === "member") {
            const btn = document.createElement("button");
            btn.textContent = "管理者にする";
            btn.onclick = () => setAdmin(m.id);
            div.appendChild(btn);
        }

        panel.appendChild(div);
    });
});
