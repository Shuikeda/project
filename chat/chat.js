const form = document.getElementById("form");
const input = document.getElementById("input");
const fileInput = document.getElementById("file-input");
const fileBtn = document.getElementById("file-btn");
const messages = document.getElementById("messages");

// メッセージ追加
function addMessage(content) {
  const li = document.createElement("li");
  li.innerHTML = content;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
}

// テキスト送信
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value.trim() !== "") {
    addMessage(input.value);
    input.value = "";
  }
});

// ファイル選択
fileBtn.addEventListener("click", () => {
  fileInput.click();
});

// ファイル送信
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file) {
    const url = URL.createObjectURL(file);
    addMessage(`📎 <a href="${url}" class="file-link" download="${file.name}">${file.name}</a>`);
  }
  fileInput.value = "";
});
