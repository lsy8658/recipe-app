"use strict";

const foodsContainer = document.querySelector(".foods");
const searchError = document.querySelector(".searchError");
const todayFoodContainer = document.querySelector(".todayFood");
const searchInput = document.querySelector("#searchInput");
const searchBtn = document.querySelector("#searchBtn");
const loadMore = document.querySelector("#loadMore");

/* 재료 보기 */
const showIngredient = (index) => {
  const ingredient = document.querySelector("#Ingredient" + index);
  const recipe = document.querySelector("#recipe" + index);
  if (ingredient) {
    if (ingredient.style.display == "block") {
      ingredient.style.display = "none";
    } else {
      ingredient.style.display = "block";
      recipe.style.display = "none";
    }
  }
};

/* 레시피 보기 */
const showRecipe = (index) => {
  const ingredient = document.querySelector("#Ingredient" + index);
  const recipe = document.querySelector("#recipe" + index);
  if (recipe) {
    if (recipe.style.display == "block") {
      recipe.style.display = "none";
    } else {
      recipe.style.display = "block";
      ingredient.style.display = "none";
    }
  }
};

const createCard = (meal, index) => {
  if (!meal && !index) return;
  const strIngredients = [];

  for (let i = 0; i < 20; i++) {
    if (meal[`strIngredient${[i]}`] !== "") {
      strIngredients.push(meal["strIngredient" + [i]]);
    }
  }

  const mealBox = `
    <div class="pt-10" >
      <div class="bg-white shadow-xl rounded overflow-hidden box-border p-4 ">
      <div class="overflow-hidden">
        <img class="w-full  h-32 sm:h-48 object-cover  hover:scale-[1.3] cursor-pointer duration-300" src="${
          meal.strMealThumb
        }" alt="${meal.strMealThumb}" /></div>
        <div class="p-4 flex flex-col">
          <span class="font-bold">${meal.strMeal}</span>
          <span class="text-sm text-gray-400">Recipe by Mario</span>
        </div>
        <div>
        <button class="bg-blue-300 text-md text-white hover:text-yellow-700 rounded-md box-border py-2 px-2" onclick="showIngredient(${index})">Recipe</button>
        <button class="bg-red-300 text-md text-white rounded-md hover:text-yellow-700 box-border py-2 px-2" onclick="showRecipe(${index})">Ingredient</button>
        </div>
      </div>
    </div>
    <div  class="hidden" id="Ingredient${index}">
      <p class="rounded-md bg-slate-300  text-md box-border  p-4">${
        meal.strInstructions
      }</p>
    </div>
    <div class="hidden" id="recipe${index}" >
      <p class="rounded-md bg-slate-300  text-md box-border  p-4">${strIngredients
        .join(", ")
        .substring(1)}</p>
    </div>
    `;

  return mealBox;
};
/* food Card 생성 */
const foodCreateCard = (text) => {
  let searchItem = "apple";
  if (text) {
    searchItem = text;
  }
  foodsContainer.innerHTML = "";
  searchError.innerHTML = "";
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchItem}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.meals) {
        data.meals.map((meal, index) => {
          const mealBox = createCard(meal, index);
          if (mealBox) {
            foodsContainer.innerHTML += mealBox;
          }
        });
      } else {
        searchError.innerHTML = `<span class="p-6 text-[18px] md:text-[20px] cursor-pointer bg-gray-700 text-white hover:text-black rounded-md px-4">다시 검색해주세요.</span>`;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

let count = 52772;
let todayCount = 0;
/* 오늘의 추천 음식 Card 생성 */
const todayRecipeCard = () => {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${count}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.meals) {
        console.log(data.meals);
        data.meals.map((meal) => {
          const mealBox = createCard(meal, todayCount + 1000);
          if (mealBox) {
            loadMore.innerHTML = "Load More";
            todayFoodContainer.innerHTML += mealBox;
            todayCount++;
          }
        });
      } else {
        loadMore.innerHTML = `<span class="text-[16px] md:text-[18px] cursor-pointer  text-white hover:text-black rounded-md px-4">한번 더 Click 해주세요.</span>`;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  count++;
};

const main = async (e) => {
  await todayRecipeCard();
  await foodCreateCard();

  searchBtn.addEventListener("click", () => {
    foodCreateCard(searchInput.value);
  });
  window.addEventListener("keypress", (e) => {
    if (e.charCode == 13) {
      foodCreateCard(searchInput.value);
      searchInput.value = "";
    }
  });

  loadMore.addEventListener("click", (e) => {
    todayRecipeCard();
  });
};

window.addEventListener("load", () => {
  searchInput.focus();
  main();
});
