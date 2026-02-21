var foodList = [];
let Foodlist;
let cartItem = [];

const cardContainer = document.getElementById("cardContainer");
const cartCountEL = document.querySelector(".cartNumber");
const Modal = document.querySelector(".modal");
const modalCloseBtn = document.querySelector(".modal-exitBtn");
const Checkoutbtn = document.getElementById("btnCartShopModal");
const totalCart = document.getElementById("totalCart");
const loginRemainder = document.getElementById("loginRemainder");

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
/////

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
  cartItem = cart;

  const existinFood = cart.find((item) => item.id === food.idMeal);

  if (existinFood) {
    existinFood.quantity++;
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
  updateCart();
  showNotification(` به سبد خرید اضافه شد ${food.strMeal}`);
}
////////render data to dom
function renderDataToDom(list) {
  cardContainer.innerHTML=''
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
      <p>${food.strMeal}</p>
      <span> ${convertNumberToPersian(food.price)}$ <span> : قیمت
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
////////display modal
let total = 0;
function displayCartModal() {
  const cart = loadUserCart();
  const cartItemsContainer = document.querySelector(".cartItemContainer");
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "سبد خرید شما خالی است.";
  } else {
    cartItemsContainer.innerHTML = "";
    cart.map((food, index) => {
      const row = document.createElement("tr");
      row.classList.add("row");
      row.innerHTML = `
                 <td>
                     <i onclick='removeFromCart(${index})' class="fa-solid fa-trash-can"></i>
                  </td>       
                 <td> 
                   ${food.quantity * food.price}$
                 </td>
                 <td>
              <div class="btn-add-mines">
                   <button onclick='changeQuantuty(${index},-1)' id='${food.id}'  class="btnChangeQuantity" >-</button>
                   <span>${food.quantity}</span>
                   <button  onclick='changeQuantuty(${index},1)' class="btnChangeQuantity" >+</button>
               </div></td>
                <td>${food.price} $</td>
                <td>${food.foodName}</td>
                <td><img src='${food.image}'   style="width: 2.3rem; height: 2.3rem" /></td> 
  `;
      total = total + food.price * food.quantity;
      console.log(total);
      cartItemsContainer.appendChild(row);
    });

    totalCart.innerHTML = `
        <h3>${convertNumberToPersian(total)}$: قیمت کل</h3>
     `;
    if (cart.length === 0 && cart.length === "undefined") {
      alert("empty cart ");
    }
    const token = localStorage.getItem("token");
    if (token) {
      Checkoutbtn.style.display = "block";
      loginRemainder.style.display = "none";
    } else {
      Checkoutbtn.style.display = "none";
      loginRemainder.style.display = "block";
    }
  }
}

/////////////////show notification
function showNotification(message, type = "success") {
  const showNotification = document.getElementById("showNotification");
  showNotification.innerHTML = message;
  showNotification.className = type === "error" ? "show error" : "show";

  setTimeout(() => {
    showNotification.style.display = none;
  }, 3000);
}

/////////change Qauntity
function changeQuantuty(index, delta) {
  let cart = loadUserCart();
  if (cart[index].quantity + delta > 0) {
    cart[index].quantity += delta;
  } else {
    removeFromCart(index);
    updateCart();
  }
  saveUserCart(cart);
  displayCartModal();
}
/////remove from cart function
function removeFromCart(index) {
  console.log("remove from cart");
  const cart = loadUserCart();
  cart.splice(index, 1);
  saveUserCart(cart);
  displayCartModal();
  updateCart();
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
///////////////search food
document.querySelector(".header-search").addEventListener("submit", (e) => {
  e.preventDefault();
  const searchQuery = document.getElementById("searchElemnt").value;
  searchFoodInApi(searchQuery);
});

//////////////search function
async function searchFoodInApi(inputValue) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`,
    );

    if (!response.ok) {
      throw new Error("faild get data from server");
    }
    const data = await response.json();
    const searchFoods=data.meals.map((food)=>{
       food.price=Math.floor(Math.random() * (60 - 5 + 1)) + 5;
       return food
    })
    console.log(searchFoods);
    renderDataToDom(searchFoods)
  } catch (error) {
    console.log(error);
  }
}
