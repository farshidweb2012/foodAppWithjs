var foodList = [];
let Foodlist;
let cartItem = [];

const cardContainer = document.getElementById("cardContainer");
const cartCountEL = document.querySelector(".cartNumber");
const Modal = document.querySelector(".modal");
const modalCloseBtn = document.querySelector(".modal-exitBtn");
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

    renderDataToDom(Foodlist);
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
    AuthContainer.classList.add("loginSignUpLink");
    AuthContainer.innerHTML = `
  <div class='loginSignUpLink'>  <a href="./login/login.html">ورود</a>  | <a href="./Signup/signup.html">ثبت نام</a></div>
    `;
  }

  const userIcon = document.getElementById("userIcon");
  userIcon.addEventListener("click", () => {
    document.querySelector(".userInfo").classList.toggle("hidden");
  });
  document.getElementById("logOut").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedUser");
    location.reload();
  });
}

window.addEventListener("load", () => {
  fetchData();
  manageAtuh();
  updateCart();
});
////add  to cart
function addToCart(food) {
  const cart = loadUserCart();
 cartItem=cart;

  const existinFood = cart.find((item) => item.id === food.idMeal);

  if (existinFood) {
    existinFood.quantity++;
    existinFood.price += food.price;
  } else {
    cart.push({
      id: food.idMeal,
      foodName: food.strMeal,
      image: food.strMealThumb,
      price: food.price,
      quantity: 1,
    });
  }
  console.log(cart);
  saveUserCart(cart);
  updateCart()
}
////////render data to dom
function renderDataToDom(list) {
  list.map((food, index) => {
    const card = document.createElement("div");
    const addBtn = document.createElement("button");
    addBtn.textContent = "add";
    addBtn.id = food.idMeal;
    addBtn.classList.add("card-btn");
    addBtn.onclick = () => addToCart(food);
    card.classList.add("card");
    card.innerHTML = `
      <img src='${food.strMealThumb}'   style="width: 100%; height: 100% ;"  />
      <span> ${convertNumberToPersian(food.price)}<p> : قیمت
    `;
    card.appendChild(addBtn);
    cardContainer.appendChild(card);
  });
}
//////handle Click

////////////////create  modal
document.querySelector("#cartIcon").addEventListener("click", (e) => {
  Modal.style.display = "block";
  displayCartModal();
});
modalCloseBtn.addEventListener("click", () => {
  Modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal")) {
    Modal.style.display = "none";
  }
});
function displayCartModal() {
  console.log("display modal ");
}
//////////////////////Save User Cart
function saveUserCart(cart) {
  const username = localStorage.getItem("loggedUser");
  localStorage.setItem(`cart_${username}`, JSON.stringify(cart));
}
/////////////update cart in dom element
function updateCart() {
  const cart = loadUserCart();
  const countCart = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartCountEL.textContent = countCart;
}

//////////////////////////Load User Cart
function loadUserCart() {
  const loggedUser = localStorage.getItem("loggedUser");
  if (!loggedUser) {
    return [];
  }
  const getUserCart = localStorage.getItem(`cart_${loggedUser}`);
  if (!getUserCart) {
    return [];
  }

  return JSON.parse(getUserCart);
}
//////////////////convert to persian language
function convertNumberToPersian(number) {
  const numbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return number.toString().replace(/\d/g, (digit) => numbers[digit]);
}

// const allCountryCategory = Array.from(
//   document.querySelectorAll(".countryImage"),
// );
// allCountryCategory.map((country) => {
//   country.addEventListener("click", (e) => {
//     if (country.getAttribute("value") === "All") {
//       country.classList.add("selected-country");
//     }
//   });
// });
