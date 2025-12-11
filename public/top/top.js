document.addEventListener("DOMContentLoaded", () => {

    const chatList = document.getElementById("chat-list");
    const createChatBtn = document.getElementById("create-chat-btn");

    // -----------------------------
    // チャット一覧を読み込む
    // -----------------------------
    loadChats();

    function loadChats() {
        fetch("/api/chats")
            .then(response => response.json())
            .then(data => {
                const chats = data.chats || [];

                // チャットがない場合
                if (chats.length === 0) {
                    chatList.innerHTML = `
                        <p style="color: #777; padding: 10px;">
                            チャットがありません。<br>
                            「チャットを作成」から始めましょう。
                        </p>
                    `;
                    return;
                }

                // チャット一覧を描画
                chatList.innerHTML = "";

                chats.forEach(chat => {
                    const li = document.createElement("li");
                    li.textContent = chat.name;
                    li.dataset.id = chat.id;

                    li.addEventListener("click", () => {
                        window.location.href = `../chat/chat.html?id=${chat.id}`;
                    });

                    chatList.appendChild(li);
                });

            })
            .catch(err => {
                console.error("チャット読み込みエラー:", err);
                chatList.innerHTML = `<p style="color:red;padding:10px;">読み込みに失敗しました</p>`;
            });
    }

    // -----------------------------
    // チャット作成画面へ
    // -----------------------------
    createChatBtn.addEventListener("click", () => {
        window.location.href = "../chat/chat_create.html";
    });

});
