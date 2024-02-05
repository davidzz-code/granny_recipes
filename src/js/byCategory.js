import { createCard, createModal } from "./byRandom";
import { getById } from "./byId";
import { addRecipeToIndexedDB } from "./indexedDB";

const urlCategories = "https://www.themealdb.com/api/json/v1/1/list.php?c=list";
const urlRecipe = "https://www.themealdb.com/api/json/v1/1/filter.php";
const categoriesContainer = document.getElementById("categories-container");
const recipesContainer = document.getElementById("recipes-container");
const modalContainer = document.getElementById("modal-container");

function createCategory(categories) {
	const categoriesList = categories.meals;
	let template = "";

	categoriesList.forEach((category) => {
		template += `<div class="border-bottom-white border-bottom-brown-hover px-3 py-2" id="category-btn">
         <h5>${category.strCategory}</h5>
      </div>
      `;
	});

	return template;
}

export async function getByCategory(category) {
	const promise = await fetch(`${urlRecipe}?c=${category}`);
	const recipes = await promise.json();

	recipesContainer.innerHTML = "";
	modalContainer.innerHTML = "";

	for (const recipe of recipes.meals) {
		const recipeById = await getById(recipe.idMeal);

		recipesContainer.innerHTML += createCard(recipeById);
		modalContainer.innerHTML += createModal(recipeById);
	}

	// Add event listener to heart buttons
	recipesContainer.addEventListener("click", (event) => {
		const target = event.target;
		if (target.classList.contains("bi-heart-fill-hover")) {
			const recipeId = target.id.split("_")[1];
			const selectedRecipe = recipes.meals.find(
				(recipe) => recipe.idMeal === recipeId
			);

			addRecipeToIndexedDB(selectedRecipe);
		}
	});
}

export async function listCategories() {
	if (categoriesContainer !== null) {
		const promise = await fetch(urlCategories);
		const categories = await promise.json();

		categoriesContainer.innerHTML = createCategory(categories);
	}
}
