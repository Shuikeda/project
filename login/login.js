document.getElementById("login-form").addEventListener("submit", (e) => {
    const name = document.getElementById("username").value.trim();
    if (name === "") {
        alert("ユーザー名を入力してください");
        e.preventDefault();
    }
});
