var foodList = [];
let Foodlist;
const cardContainer = document.getElementById("cardContainer");
async function fetchData() {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?s",
    );

    if (!response.ok) {
      throw new Error("faild get data from server");
    }

    const data = await response.json();

    foodList = data.meals;
    Foodlist = foodList.map((meal) => {
      meal.price = Math.floor(Math.random() * (60 - 5 + 1)) + 5;
      return meal;
    });

    renderDataToDom(foodList);
  } catch (error) {
    console.log(error);
  }
}

//manage auth
function manageAtuh() {
  const AuthContainer = document.getElementById("authSection");

  const token = localStorage.getItem("token");
  if (token) {
    const loggedUser = localStorage.getItem("loggedUser");
    AuthContainer.innerHTML = `
    <div class='userInfo-container'>   
        <i id='userIcon' aria-colspan="cartIcon" class="fa-solid fa-user fa-2x"></i>
      <div   class='hidden userInfo '>
        <div >${loggedUser}   <i aria-colspan="cartIcon" class="fa-solid fa-user"></i> </div>
        <a  id='logOut' href='#'><span>خروج</span>  <i class="fas fa-sign-out-alt""></i></a>
      </div>
    </div>
 
    `;
  } else {
    AuthContainer.classList.add('loginSignUpLink')
    AuthContainer.innerHTML = `
  <div class='loginSignUpLink'>  <a href="./login/login.html">ورود</a>  | <a href="./Signup/signup.html">ثبت نام</a></div>
    `;
  }

  const userIcon = document.getElementById("userIcon");
  userIcon.addEventListener("click", () => {
    document.querySelector(".userInfo").classList.toggle("hidden");
  });
  document.getElementById("logOut").addEventListener("click", () => {
    alert('exit')
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    location.reload();
  });
}

window.addEventListener("load", () => {
  fetchData();
  manageAtuh();
});

function renderDataToDom(list) {
  list.map((food) => {
    const card = document.createElement("div");
    card.id = food.idMeal;
    card.classList.add("card");
    card.innerHTML = `
         <img class='foodImage' src='${food.strMealThumb}' />
         <p>${food.strMeal}</P>
         <span>${convertNumberToPersian(food.price)}$</span>
         <button id='btn-addCart' class='card-btn'>اضافه کردن یه سبد خرید</button>
      `;
    cardContainer.appendChild(card);
  });
}

function convertNumberToPersian(number) {
  const numbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return number.toString().replace(/\d/g, (digit) => numbers[digit]);
}

const allCountryCategory = Array.from(
  document.querySelectorAll(".countryImage"),
);
allCountryCategory.map((country) => {
  country.addEventListener("click", (e) => {
    if (country.getAttribute("value") === "All") {
      country.classList.add("selected-country");
    }
  });
});
