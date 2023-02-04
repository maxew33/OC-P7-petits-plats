import Api from "../api/Api.js"
import Recipe from "../models/Recipe.js"
import RecipeCard from "../templates/RecipeCard.js"

const api = new Api('data/recipes.json'),
    recipesContainer = document.querySelector('.recipes'),
    ingredientsArray = []

async function main() {

    const recipesInfos = await api.getRecipes()

    // todo : essayer de sortir l'appendchild de la boucle

    recipesInfos
        .map(recipe => new Recipe(recipe))
        .forEach(recipe => {
            const card = new RecipeCard(recipe)
            const myCard = card.createRecipeCard()
            recipesContainer.appendChild(myCard)

            recipe.ingredientsArray.forEach(ingredient => ingredientsArray.indexOf(ingredient)===-1 && ingredientsArray.push(ingredient))
        })

        console.log(ingredientsArray)
}

main()