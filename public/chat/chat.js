document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(location.search);
    const chatId = params.get("id");
    if (!chatId) {
        alert("チャットIDがありません");
        return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
        location.href = "/login/login.html";
        return;
    }

    const messagesDiv = document.getElementById("messages");
    const input = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    const memberPanel = document.getElementById("member-panel");

    /* --- 過去メッセージ --- */
    fetch(`/api/messages/${chatId}`, {
        headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {
        data.messages.forEach(addMessage);
    });

    /* --- メンバー一覧 --- */
    fetch(`/api/chats/${chatId}/members`, {
        headers: { Authorization: "Bearer " + token }
    })
    .then(res => res.json())
    .then(data => {
        data.members.forEach(m => {
            const div = document.createElement("div");
            div.textContent = `${m.username} (${m.role})`;
            memberPanel.appendChild(div);
        });
    });

    /* --- WebSocket --- */
    const ws = new WebSocket(`ws://localhost:3000?token=${token}`);

    ws.onmessage = e => {
        const msg = JSON.parse(e.data);
        if (msg.chatId == chatId) {
            addMessage(msg);
        }
    };

    sendBtn.onclick = () => {
        const text = input.value.trim();
        if (!text) return;

        ws.send(JSON.stringify({
            chatId,
            content: text
        }));

        input.value = "";
    };

    function addMessage(msg) {
        const div = document.createElement("div");
        div.textContent = `${msg.username}: ${msg.content}`;
        messagesDiv.appendChild(div);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
});
