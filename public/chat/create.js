document.addEventListener("DOMContentLoaded", () => {

    const createBtn = document.getElementById("create-btn");

    createBtn.addEventListener("click", () => {
        const name = document.getElementById("chat-name").value;

        if (!name) {
            alert("チャット名を入力してください");
            return;
        }

        fetch("/api/chats/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                alert("チャットを作成しました！");
                window.location.href = `/chat/chat.html?id=${data.chatId}`;
            } else {
                alert("作成に失敗しました");
            }
        });
    });

});
