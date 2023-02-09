import Api from "../api/Api.js"
import Recipe from "../models/Recipe.js"
import RecipeCard from "../templates/RecipeCard.js"
import TagList from "../templates/TagList.js"

const api = new Api('data/recipes.json'),
    recipesInfos = [],// all recipes
    tempRecipesInfos = [],// recipes temp array
    $recipesContainer = document.querySelector('.recipes'),
    $recipeCard = [],
    $tagsList = Array.from(document.querySelectorAll('.tags__list')),
    $tagsBtn = [],
    $searchInput = document.querySelector('#search__text'),
    ingredientsArray = [],
    applianceArray = [],
    ustensilsArray = [],
    descriptionArray = [],
    tagsArray = [{ ingredients: ingredientsArray }, { appliance: applianceArray }, { ustensils: ustensilsArray }],
    recipesTags = [],
    $tagsButtons = Array.from(document.querySelectorAll('.tags__btn'))

let searchWord = '',
    filtered = false // if the recipes have already been filtered

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

            const recipeTags = { id: recipe.id, ingredients: recipe.ingredientsArray, ustensils: recipe.ustensilsArray, appliance: recipe.applianceArray }
            recipesTags.push(recipeTags)
        })

    //create the tags and fill the tags container
    tagsArray.forEach((elt, idx) => {
        const myListData = new TagList(Object.values(elt)[0])
        const myList = myListData.createTagList(Object.keys(elt)[0])
        $tagsList[idx].appendChild(myList)
    })

    //fill my recipe cards array with all the created cards
    Array.from(document.querySelectorAll('.card')).forEach(elt => { $recipeCard.push(elt) })
    //fill my tags buttons array with all the created tags    
    // Array.from(document.querySelectorAll('.tag__btn')).forEach(elt => { $tagsBtn.push(elt) })
    $tagsList.forEach(list =>  $tagsBtn.push(list.querySelectorAll('.tag__btn')))
}

const displayCards = recipes => {
    //creation of the id array
    const idArray = []

    recipes.forEach(recipe => idArray.push(recipe.id))

    $recipeCard.forEach(card => card.style.display = idArray.includes(+card.dataset.id) ? 'block' : 'none')
}

const displayTags = recipes => {

    //clear the tags array
    tagsArray.forEach(tag => Object.values(tag)[0].length = 0)

    //fill the arrays
    recipes.forEach(recipe => {
        
        const myRecipe = recipesTags.find(tag => tag.id === recipe.id)

        const myArrays = [[myRecipe.ingredients, ingredientsArray], [myRecipe.ustensils, ustensilsArray], [myRecipe.appliance, applianceArray]]
        myArrays.forEach(array => fillArrays(array[0], array[1]))
    })

    console.log(tagsArray)

    tagsArray.forEach((tag, idx) => {
        console.log(Object.keys(tag)[0])
        const myListData = Object.values(tag)[0]
        const valueArray = []
        myListData.forEach(value => valueArray.push(value))
    
        $tagsBtn[idx].forEach(tag => tag.style.display = valueArray.includes(tag.dataset.value) ? 'block' : 'none')
    })

}

const fillArrays = (arrayValues, arrayToFill) => {
    arrayValues.forEach(elt => arrayToFill.indexOf(elt) === -1 && arrayToFill.push(elt))
}

$searchInput.addEventListener('input', () => {
    searchWord = $searchInput.value.length > 2 ? $searchInput.value : filtered && (filtered = !filtered, displayCards(recipesInfos))
    searchWord && filteringRecipes(searchWord, tempRecipesInfos)
})

const filteringRecipes = (word, recipes) => {

    !filtered && (filtered = true)

    const searchedWord = word.toLowerCase()

    const tempRecipes = []

    recipes.forEach(recipe => {
        const { name, ingredients, description } = recipe

        let myIngredients = '',
            myDescription = description.toLowerCase(),
            myName = name.toLowerCase()

        ingredients.forEach(elt => myIngredients += elt.ingredient.toLowerCase() + ' ')

        if (myName.match(searchedWord)) {
            tempRecipes.push(recipe)
        }
        else if (myIngredients.match(searchedWord)) {
            tempRecipes.push(recipe)
        }
        else if (myDescription.match(searchedWord)) {
            tempRecipes.push(recipe)
        }
    }
    )

    console.log(tempRecipes)

    // fillRecipes(tempRecipes)
    displayCards(tempRecipes)
    displayTags(tempRecipes)
}

$tagsButtons.forEach(btn => btn.addEventListener('click', e => {
    console.log('e')
    e.target.parentElement.setAttribute('aria-expanded', 'true')
}))

getRecipes()