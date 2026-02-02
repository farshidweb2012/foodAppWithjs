document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  let users = JSON.parse(localStorage.getItem("users")) || [];
  //   let storedUsers = localStorage.getItem("users");

  //   if (storedUsers) {
  //     users = JSON.parse(storedUsers);
  //   } else {
  //     users = [];
  //   }
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    showNotification("این کاربر قبلا ثبت نام کرده است",'error');
    return;
  }
  users.push({ username, password });

  localStorage.setItem("users", JSON.stringify(users));
  showNotification("ثبت نام با موفقیت انجام شد");
  
});

function showNotification(message, type = "success") {
  const showNotification = document.getElementById("showNotification");
  showNotification.innerHTML = message;
  showNotification.className = type === "error" ? "show error" : "show";

  setTimeout(() => {
    showNotification.style.display = none;
  }, 3000);
}
