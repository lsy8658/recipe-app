"use strict";
const foodsContainer = document.querySelector(".foods");
const foodFetch = (text) => {
  let searchItem = "apple";
  if (text) {
    searchItem = text;
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchItem}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data.meals);
      if (data.meals) {
        data.meals.map((meal) => {
          const mealBox = `
            <div class="pt-10">
              <div class="bg-white shadow-mb rounded overflow-hidden">
                <img class="w-full md:w-[300px] h-[200px] object-cover" src="${meal.strMealThumb}" alt="${meal.strMealThumb}" />
                <div>
                  <span>${meal.strMeal}</span>
                  <span>Recipe by Mario</span>
                </div>
              </div>
            </div>
            `;
          foodsContainer.innerHTML += mealBox;
        });
      } else {
        foodsContainer.innerHTML = `<span>찾을 수 없습니다.</span>`;
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const main = () => {
  foodFetch();
};

main();
