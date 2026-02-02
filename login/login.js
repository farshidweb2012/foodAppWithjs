document.querySelector(".form").addEventListener("submit", (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  let savedUsers = JSON.parse(localStorage.getItem("users")) || [];
  const validUser = savedUsers.find(
    (user) => user.username === username && user.password === password,
  );

  if (validUser) {
    const token = btoa(
      JSON.stringify({
        username,
        exp: Date().now + 86400000,
      }),
    );
    localStorage.setItem('token',token);
    localStorage.setItem('loggedUser',username)
    window.location.href='../index.html'
  }else{
       alert('نام کاربری یا رمز اشتباه است')
  }
});
