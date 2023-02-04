import Api from "../api/Api.js"
import Recipe from "../models/Recipe.js"
import RecipeCard from "../templates/RecipeCard.js"

const api = new Api('data/recipes.json'),
    recipesContainer = document.querySelector('.recipes'),
    ingredientsArray = [],
    descriptionArray = [],
    ustensilsArray = []

async function main() {

    const recipesInfos = await api.getRecipes()

    // todo : essayer de sortir l'appendchild de la boucle

    recipesInfos
        .map(recipe => new Recipe(recipe))
        .forEach(recipe => {
            const card = new RecipeCard(recipe)
            const myCard = card.createRecipeCard()
            
            recipesContainer.appendChild(myCard)

            const myArrays = [[recipe.ingredientsArray, ingredientsArray], [recipe.descriptionArray, descriptionArray], [recipe.ustensilsArray, ustensilsArray]]
            myArrays.forEach(array => fillArrays(array[0], array[1]))
        })

    console.log(ingredientsArray, descriptionArray, ustensilsArray)
}

const fillArrays = (arrayValues, arrayToFill) => {
    arrayValues.forEach(elt => arrayToFill.indexOf(elt) === -1 && arrayToFill.push(elt))
    console.log()
}

main()