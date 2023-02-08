import Api from "../api/Api.js"
import Recipe from "../models/Recipe.js"
import RecipeCard from "../templates/RecipeCard.js"
import TagList from "../templates/TagList.js"

const api = new Api('data/recipes.json'),
    recipesInfos = [],// all recipes
    tempRecipesInfos = [],// recipes temp array
    $recipesContainer = document.querySelector('.recipes'),
    $tagsList = Array.from(document.querySelectorAll('.tags__list')),
    $searchInput = document.querySelector('#search__text'),
    ingredientsArray = [],
    applianceArray = [],
    ustensilsArray = [],
    descriptionArray = [],
    tagsArray = [{ ingredients: ingredientsArray }, { appliance: applianceArray }, { ustensils: ustensilsArray }]

let searchWord = ''

async function getRecipes() {

    /* Getting the recipes from the API and pushing them into the recipesInfos and the temp recipes array. */
    const recipes = await api.getRecipes()
    recipesInfos.push(...Array.from(recipes, x => x))
    tempRecipesInfos.push(...Array.from(recipes, x => x))

    fillRecipes(tempRecipesInfos)
}

const fillRecipes = recipes => {

    $recipesContainer.innerHTML = ''

    // todo : essayer de sortir l'appendchild de la boucle
    // essayer de ne pas refaire des appendchild à chaque fois mais plutôt utiliser des dataset id pour display ou non les recettes

    recipes.map(recipe => new Recipe(recipe))
        .forEach(recipe => {
            const card = new RecipeCard(recipe)
            const myCard = card.createRecipeCard()

            $recipesContainer.appendChild(myCard)

            const myArrays = [[recipe.ingredientsArray, ingredientsArray], [recipe.descriptionArray, descriptionArray], [recipe.ustensilsArray, ustensilsArray], [recipe.applianceArray, applianceArray]]
            myArrays.forEach(array => fillArrays(array[0], array[1]))
        })

    tagsArray.forEach((elt, idx) => {
        console.log(Object.values(elt)[0])
        const myListData = new TagList(Object.values(elt)[0])
        const myList = myListData.createTagList(Object.keys(elt)[0])
        $tagsList[idx].appendChild(myList)
    })

    console.log(applianceArray)
}

const fillArrays = (arrayValues, arrayToFill) => {
    arrayValues.forEach(elt => arrayToFill.indexOf(elt) === -1 && arrayToFill.push(elt))
    console.log()
}

$searchInput.addEventListener('input', () => {
    searchWord = $searchInput.value.length > 2 ? $searchInput.value : ''
    console.log(searchWord)
    searchWord && filteringRecipes(searchWord, tempRecipesInfos)
})

const filteringRecipes = (word, recipes) => {
    console.log(word, recipes)

    const searchedWord = word.toLowerCase()

    const tempRecipes = []

    recipes.forEach(recipe => {
        const { name, ingredients, description } = recipe

        let myIngredients = '',
            myDescription = description.toLowerCase()

        ingredients.forEach(elt => myIngredients += elt.ingredient.toLowerCase() + ' ')

        if (name.toLowerCase().match(searchedWord)) {
            console.log('name match')
            tempRecipes.push(recipe)
        }
        else if (myIngredients.match(searchedWord)) {
            console.log('ingredients match')
            tempRecipes.push(recipe)
        }
        else if (myDescription.match(searchedWord)) {
            console.log('description match')
            tempRecipes.push(recipe)
        }
    }
    )

    fillRecipes(tempRecipes)

}

getRecipes()