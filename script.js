"use strict";
const searchField = document.querySelector(".search-term");
const inputSearchBtn = document.querySelector(".input-btn");
const mainMeal = document.querySelector(".meal");
const meals = document.querySelector(".meals");
const favMealList = document.querySelector(".fav-meals");
const pullUpFavList = document.querySelector(".fav-btn");
const searchBtn = document.querySelector(".search");
const favBtn = document.querySelector(".fav-btn");

const randomBtn = document.querySelector(".random-btn");

const fetchRandomMeal = async function () {
  const res = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`);
  const resData = await res.json();
  const randomMeal = resData.meals[0];

  addMeal(randomMeal);
};

const fetchById = async function (id) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const resData = await res.json();
  console.log(resData);
  const meal = resData.meals[0];
  return meal;
};

const fetchByName = async function (name) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  const resData = await res.json();
  const meal = resData.meals;

  return meal;
};

const mealHTML = function (mealData) {
  const meal = document.createElement("div");
  meal.classList.add("meal");
  meal.innerHTML = `
  <div class="meal-img">
  <img
    src="${mealData.strMealThumb}"
    alt="${mealData.strMeal}"
  />
</div>
<div class="meal-name">
  <h4>${mealData.strMeal}</h4>
  <button class="fav-btn">
    <i class="fa-regular fa-heart"></i>
  </button>
</div>
</div>
  `;

  meals.appendChild(meal);

  return meal;
};

const addMeal = function (mealData) {
  mealHTML(mealData);

  const favBtn = document.querySelector(".fav-btn");
  const icon = document.querySelector(".fa-heart");
  favBtn.addEventListener("click", function () {
    if (favBtn.classList.contains("active")) {
      icon.classList.add("fa-regular");
      icon.classList.remove("fa-solid");
      favBtn.classList.remove("active");

      unstoreFavMeal(mealData.idMeal);
    } else {
      icon.classList.add("fa-solid");
      icon.classList.remove("fa-regular");
      favBtn.classList.add("active");

      storeFavMeal(mealData.idMeal);
    }

    fetchFavMeals();
  });

  // return meal;
};

const storeFavMeal = function (favMeal) {
  const mealIds = getFavStore();
  localStorage.setItem("favIds", JSON.stringify([...mealIds, favMeal]));
};

const unstoreFavMeal = function (favMeal) {
  const mealIds = getFavStore();

  localStorage.setItem(
    "favIds",
    JSON.stringify(mealIds.filter((id) => id !== favMeal))
  );
};

const getFavStore = function () {
  const mealIds = JSON.parse(localStorage.getItem("favIds"));

  if (mealIds) {
    return mealIds;
  } else return [];
};

const fetchFavMeals = async function () {
  favMealList.innerHTML = ``;

  const mealIds = getFavStore();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    const meal = await fetchById(mealId);
    displayFavMeals(meal);
  }
};

const favToMainDisp = function (favObj) {
  meals.innerHTML = ``;
  mealHTML(favObj);
  const meal = document.querySelector(".meal");

  const favBtn = document.querySelector(".fav-btn");
  favBtn.classList.add("active");
  favBtn.classList;
  const icon = document.querySelector(".fa-heart");
  icon.classList.remove("fa-regular");
  icon.classList.add("fa-solid");
  console.log(favBtn.classList);
  favBtn.addEventListener("click", function () {
    if (favBtn.classList.contains("active")) {
      icon.classList.add("fa-regular");
      icon.classList.remove("fa-solid");
      favBtn.classList.remove("active");

      unstoreFavMeal(favObj.idMeal);
    } else {
      icon.classList.add("fa-solid");
      icon.classList.remove("fa-regular");
      favBtn.classList.add("active");

      storeFavMeal(favObj.idMeal);
    }
    fetchFavMeals();
  });
};

const displayFavMeals = function (mealObj) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
  <img
    src="${mealObj.strMealThumb}"
  />
  <span>${mealObj.strMeal}</span>
  `;
  favMeal.addEventListener("click", () => {
    favToMainDisp(mealObj);
  });

  favMealList.appendChild(favMeal);
};

const displayPopup = async function () {
  console.log(searchField.value);
  meals.innerHTML = ``;

  const searchMeals = await fetchByName(searchField.value);

  console.log(searchMeals);
  if (searchMeals) {
    let i = 0;
    while (searchMeals[i] && i < 10) {
      const meal = searchMeals[i];
      mealHTML(meal);
      i++;
    }
    const favBtns = document.querySelectorAll(".fav-btn");
    favBtns.forEach((favBtn, i) => {
      favBtn.addEventListener("click", function () {
        const icon = document.querySelector(".icon");
        if (favBtn.classList.contains("active")) {
          favBtn.innerHTML = ` <i class="fa-regular fa-heart"></i>`;
          favBtn.classList.remove("active");
          unstoreFavMeal(searchMeals[i].idMeal);
        } else {
          favBtn.innerHTML = ` <i class="fa-solid fa-heart"></i>`;
          favBtn.classList.add("active");
          storeFavMeal(searchMeals[i].idMeal);
        }

        fetchFavMeals();
      });
    });
  }
};

inputSearchBtn.addEventListener("click", displayPopup);

fetchRandomMeal();
fetchFavMeals();
