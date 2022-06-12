"use strict";
const meal = document.querySelector(".meal");
const meals = document.querySelector(".meals");
const favMealList = document.querySelector(".fav-meals");
const pullUpFavList = document.querySelector(".fav-btn");

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
  const meal = resData.meals[0];
  return meal;
};

const fetchByName = async function (name) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`
  );
  const resData = await res.json();
  const meal = resData.meals[0];
  return meal;
};

const addMeal = function (mealData) {
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

  const favBtn = meal.querySelector(".fav-btn");
  const icon = meal.querySelector(".fa-heart");
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

  return meal;
};

const storeFavMeal = function (favMeal) {
  const mealIds = getFavStore();
  localStorage.setItem("favIds", JSON.stringify([...mealIds, favMeal]));
};

const unstoreFavMeal = function (favMeal) {
  const mealIds = getFavStore();
  console.log(favMeal);

  localStorage.setItem(
    "favIds",
    JSON.stringify(mealIds.filter((id) => id !== favMeal))
  );
  console.log(mealIds);
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

const displayFavMeals = function (mealObj) {
  const favMeal = document.createElement("li");

  favMeal.innerHTML = `
  <img
    src="${mealObj.strMealThumb}"
  />
  <span>${mealObj.strMeal}</span>
  `;

  favMealList.appendChild(favMeal);
};

const favDisplayMain = async function () {
  const mealIds = getFavStore();

  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    const meal = await fetchById(mealId);
    addMeal(meal);
  }
};

pullUpFavList.addEventListener("click", () => {
  document.querySelector(".meal").innerHTML = ``;
  favDisplayMain();
});

fetchRandomMeal();
fetchFavMeals();
