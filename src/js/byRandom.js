const urlRecipes = "https://www.themealdb.com/api/json/v1/1/random.php";
const recipesContainer = document.getElementById("recipes-container");
const modalContainer = document.getElementById("modal-container");
import { addRecipeToIndexedDB } from "./indexedDB";

/**
 * Funciónn Crear card
 *
 * Crea una plantilla HTML para una card basado en el objeto de receta proporcionado.
 * @param {Object} recipe - El objeto de receta que contiene detalles sobre la comida.
 * @returns {string} - La plantilla HTML para el modal.
 */
export function createCard(recipe) {
	const template = `
   <div class="col-3">
      <div class="card mb-4" style="width: 18rem;">
         <img src="${recipe.meals[0].strMealThumb}" class="card-img-top" alt="Food photo">
         <div class="card-body">
            <h5 class="card-title">${recipe.meals[0].strMeal}</h5>
            <p class="card-text">${recipe.meals[0].strCategory}</p>
            <a href="#" class="btn btn-dark bi bi-heart-fill bi-heart-fill-hover" id="favBtn_${recipe.meals[0].idMeal}"></a>
            <button type="button" class="btn btn-warning" data-bs-toggle="modal" data-bs-target="#modal_${recipe.meals[0].idMeal}">
               More info
            </button>
         </div>
      </div>
   </div>`;
	return template;
}

/**
 * Funciónn Crear modal
 *
 * Crea una plantilla HTML para un modal basado en el objeto de receta proporcionado.
 * @param {Object} recipe - El objeto de receta que contiene detalles sobre la comida.
 * @returns {string} - La plantilla HTML para el modal.
 */
export function createModal(recipe) {
	const recipeId = recipe.meals[0].idMeal;
	const recipeTitle = recipe.meals[0].strMeal;
	const recipeImage = recipe.meals[0].strMealThumb;
	const recipeInstructions = recipe.meals[0].strInstructions;
	const recipeCategory = recipe.meals[0].strCategory;
	const recipeArea = recipe.meals[0].strArea;
	const ingredientsList = createIngredientsList(recipe.meals[0]);

	const template = `
      <div class="modal fade" id="modal_${recipeId}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
         <div class="modal-dialog modal-xl">
         <div class="modal-content">
            <div class="modal-header">
               <h1 class="modal-title" id="exampleModalLabel">${recipeTitle} - <span class="text-secondary">${recipeCategory}</span></h1>
               <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body d-flex flex-column">

               <div class="d-flex h-auto">
                  <img src="${recipeImage}" class="h-400 rounded" alt="Food photo"/>

                  <div class="d-flex flex-grow-1 justify-content-around align-items-start">
                     <div class="d-flex flex-column justify-content-start">
                        <h3>Ingredients</h3>
                        <ul class="mt-2">
                           ${ingredientsList}
                        </ul>
                     </div>
                     <div class="d-flex flex-column align-items-start w-max-400">
                        <h3 class="text-center">Info</h3>
                        <p><span class="fw-bold">Area:</span> ${recipeArea}</p>
                        <p><span class="fw-bold">Food category:</span> ${recipeCategory}</p>
                     </div>
                  </div>
               </div>

               <div class="mt-3">
                  <h3>Instructions</h3>
                  <p class="text-justify">${recipeInstructions}</p>
               </div>
            </div>
            <div class="modal-footer">
               <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
               <button type="button" class="btn btn-dark bi bi-heart-fill bi-heart-fill-hover favBtn"></button>
            </div>
         </div>
         </div>
      </div>`;

	return template;
}

/**
 * Función Create ingredients list
 *
 * Crea una lista de ingredientes y medidas a partir de un objeto de receta.
 * @param {Object} meal - Objeto que contiene información de la receta.
 * @returns {string} - Cadena HTML que representa una lista de ingredientes y medidas.
 */
function createIngredientsList(meal) {
	let ingredientsList = "";
	for (let i = 1; i < 20; i++) {
		const ingredient = meal[`strIngredient${i}`];
		const measure = meal[`strMeasure${i}`];

		if (ingredient == null || measure == null) {
			break;
		} else if (!ingredient.trim() && !measure.trim()) {
			break;
		}

		ingredientsList += `<li me-3>${ingredient} - ${measure}</li>`;
	}
	return ingredientsList;
}

export async function getByRandom() {
	const promises = [];

	if (recipesContainer !== null && modalContainer !== null) {
		for (let i = 0; i <= 7; i++) {
			const response = await fetch(urlRecipes);
			const recipe = await response.json();

			promises.push(recipe);
		}

		const randomRecipes = await Promise.all(promises);
		randomRecipes.forEach((randomRecipe) => {
			recipesContainer.innerHTML += createCard(randomRecipe);
			modalContainer.innerHTML += createModal(randomRecipe);
		});

		// Add event listener to heart buttons using event delegation
		recipesContainer.addEventListener("click", (event) => {
			const target = event.target;
			if (target.classList.contains("bi-heart-fill-hover")) {
				const recipeId = target.id.split("_")[1];
				const selectedRecipe = randomRecipes.find(
					(recipe) => recipe.meals[0].idMeal === recipeId
				);

				if (selectedRecipe) {
					addRecipeToIndexedDB(selectedRecipe);
				}
			}
		});
	}
}
