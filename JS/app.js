const DOMstrings = {
  search: document.getElementById("search"),
  submit: document.getElementById("submit"),
  random: document.getElementById("random"),
  mealsEl: document.getElementById("meals"),
  resultHeading: document.getElementById("result-heading"),
  single_mealEl: document.getElementById("single-meal")
};

const term = DOMstrings.search.value;

async function serachMeal(e) {
  e.preventDefault();
  DOMstrings.single_mealEl.innerHTML = "";
  const term = DOMstrings.search.value;
  if (term.trim()) {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    const res = await fetch(
      `${proxy}https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
    );
    const data = await res.json();
    DOMstrings.resultHeading.innerHTML = `<h2>Search results for '${term}': </h2>`;
    if (data.meals === null) {
      DOMstrings.resultHeading.innerHTML = `<p> There are no search results. Try again </p>`;
    } else {
      DOMstrings.mealsEl.innerHTML = data.meals
        .map(
          meal =>
            `<div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
                <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
                </div>
                </div>
                `
        )
        .join("");
    }
    DOMstrings.search.value = "";
  } else {
    alert("Please enter a meal!");
  }
}

async function getMealById(mealID) {
  const proxy = "https://cors-anywhere.herokuapp.com/";
  const res = await fetch(
    `${proxy}https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  const data = await res.json();
  const meal = data.meals[0];
  console.log(meal);
  addMealToDOM(meal);
}
async function randomMeal(){

  DOMstrings.mealsEl.innerHTML= '';
  DOMstrings.resultHeading.innerHTML='';
  const proxy = "https://cors-anywhere.herokuapp.com/";
  const res = await fetch(
    `${proxy}https://www.themealdb.com/api/json/v1/1/random.php`
  );
  const data = await res.json();
  const meal = data.meals[0];
  
  addMealToDOM(meal);
}
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }
  DOMstrings.single_mealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
      ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ''}
      ${meal.strArea ? `<p>${meal.strArea}</p>` : ''}
    </div>
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
      </ul>
    </div>
  </div>
`;
}

DOMstrings.submit.addEventListener("submit", serachMeal);
DOMstrings.random.addEventListener('click',randomMeal);
DOMstrings.mealsEl.addEventListener("click", e => {
  const mealInfo = e.path.find(item => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealID = mealInfo.getAttribute("data-mealid");
    getMealById(mealID);
  }
});
