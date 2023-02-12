import Api from "../api/Api.js"
import Recipe from "../models/Recipe.js"
import RecipeCard from "../templates/RecipeCard.js"
import TagList from "../templates/TagList.js"

const api = new Api('data/recipes.json'),
    recipesInfos = [],// all recipes
    tempRecipesInfos = [],// recipes temp array
    searchBarRecipes = [],
    tagsRecipes = [],
    $recipesContainer = document.querySelector('.recipes'),
    $recipeCard = [],
    $tagsList = Array.from(document.querySelectorAll('.tags__list')),
    $tagsBtn = [],
    $searchInput = document.querySelector('#search__text'),
    ingredientsArray = [],
    applianceArray = [],
    ustensilsArray = [],
    tagsArray = [{ ingredients: ingredientsArray }, { appliance: applianceArray }, { ustensils: ustensilsArray }],
    recipesTags = [],
    tagsSelected = { ingredients: [], appliance: [], ustensils: [] },
    $tagsOpener = Array.from(document.querySelectorAll('.tags__opener')),
    $tagSelectedContainer = document.querySelector('.tags__selected'),
    tagsRecipesIdArray = {}

let filtered = false // if the recipes have already been filtered


// GET RECIPES

async function getRecipes() {

    /* Getting the recipes from the API and pushing them into the recipesInfos and the temp recipes array. */
    const recipes = await api.getRecipes()
    recipesInfos.push(...Array.from(recipes, x => x))
    tempRecipesInfos.push(...Array.from(recipes, x => x))

    fillPage(tempRecipesInfos)
}

// CREATE ALL THE DOM ELEMENTS (REICPES AND TAGS)

const fillPage = recipes => {

    $recipesContainer.innerHTML = ''

    // todo : essayer de sortir l'appendchild de la boucle
    // essayer de ne pas refaire des appendchild à chaque fois mais plutôt utiliser des dataset id pour display ou non les recettes

    //create the card for the recipes
    recipes.map(recipe => new Recipe(recipe))
        .forEach(recipe => {
            const card = new RecipeCard(recipe)
            const myCard = card.createRecipeCard()

            $recipesContainer.appendChild(myCard)

            const myArrays = [[recipe.ingredientsArray, ingredientsArray], [recipe.ustensilsArray, ustensilsArray], [recipe.applianceArray, applianceArray]]
            myArrays.forEach(array => fillArrays(array[0], array[1], recipe.id))

            const recipeTags = { id: recipe.id, ingredients: recipe.ingredientsArray, ustensils: recipe.ustensilsArray, appliance: recipe.applianceArray }
            recipesTags.push(recipeTags)
        })

    //fill my recipe cards array with all the created cards
    Array.from(document.querySelectorAll('.card')).forEach(elt => { $recipeCard.push(elt) })

    //create the tags and fill the tags container
    tagsArray.forEach((elt, idx) => {
        const myListData = new TagList(Object.values(elt)[0])
        const myList = myListData.createTagList(Object.keys(elt)[0])
        $tagsList[idx].appendChild(myList)
    })


    //fill my tags buttons array with all the created tags    
    $tagsList.forEach(list => $tagsBtn.push(list.querySelectorAll('.tag__btn')))
    $tagsBtn.forEach(btnList => btnList.forEach(btn => btn.addEventListener('click', e => tagClicked(e))))
}

// fill the 

const fillArrays = (arrayValues, arrayToFill, id) => {
 
    arrayValues.forEach(elt => {
        tagsRecipesIdArray[elt] ? tagsRecipesIdArray[elt].push(id) : tagsRecipesIdArray[elt]=[id]

        arrayToFill.indexOf(elt) === -1 && arrayToFill.push(elt)})
}

// UPDATE THE PAGE WITH THE FILTERED DATA (RECIPE / TAGS)

const updatePage = recipes => {

    // update the recipes cards

    //creation of the id array
    const idArray = []

    recipes.forEach(recipe => idArray.push(recipe.id))

    $recipeCard.forEach(card => card.style.display = idArray.includes(+card.dataset.id) ? 'block' : 'none')


    // update the recipes tags

    //clear the tags array
    tagsArray.forEach(tag => Object.values(tag)[0].length = 0)

    //fill the arrays
    recipes.forEach(recipe => {

        const myRecipe = recipesTags.find(tag => tag.id === recipe.id)

        const myArrays = [[myRecipe.ingredients, ingredientsArray], [myRecipe.ustensils, ustensilsArray], [myRecipe.appliance, applianceArray]]
        myArrays.forEach(array => fillArrays(array[0], array[1]))
    })

    //display the tags
    tagsArray.forEach((tag, idx) => {
        const myListData = Object.values(tag)[0]
        const valueArray = []
        myListData.forEach(value => valueArray.push(value))

        $tagsBtn[idx].forEach(tag => tag.style.display = valueArray.includes(tag.dataset.value) ? 'block' : 'none')
    })
}

// SEARCH A RECIPE
// with search bar

$searchInput.addEventListener('input', () => {
    $searchInput.value.length > 2 ? filteringRecipes($searchInput.value, tempRecipesInfos) : filtered && (filtered = !filtered, updatePage(recipesInfos))
})

const filteringRecipes = (word, recipes) => {

    !filtered && (filtered = true)

    const searchedWord = word.toLowerCase()

    searchBarRecipes.length = 0

    recipes.forEach(recipe => {
        const { name, ingredients, description } = recipe

        let myIngredients = '',
            myDescription = description.toLowerCase(),
            myName = name.toLowerCase()

        ingredients.forEach(elt => myIngredients += elt.ingredient.toLowerCase() + ' ')

        if (myName.match(searchedWord)) {
            searchBarRecipes.push(recipe)
        }
        else if (myIngredients.match(searchedWord)) {
            searchBarRecipes.push(recipe)
        }
        else if (myDescription.match(searchedWord)) {
            searchBarRecipes.push(recipe)
        }
    }
    )


    // fillPage(tempRecipes)
    updatePage(searchBarRecipes)
    // displayTags(tempRecipes)
}


// TAGS SEARCH

const tagClicked = e => {
    // tagsSelected.Object.keys(e.target.parentElement.className).push(e.target.dataset.value)

//set the style of the clicked tag and add it in the tags container
    Object.keys(tagsSelected).forEach(tagCategory => {
        if (tagCategory === e.target.parentElement.className) {
            tagsSelected[tagCategory].push(e.target.dataset.value)
            e.target.setAttribute('aria-selected', 'true')
            createTagSelectedElement(e.target.dataset.value, tagCategory)
        }
    })

    tagsRecipes.length === 0 && (tagsRecipes.push(...recipesInfos))

    const tempRecipesList = []

    tagsRecipesIdArray[e.target.dataset.value].forEach(id => tagsRecipes.forEach(recipe => recipe.id === id && tempRecipesList.push(recipe)))


    tagsRecipes.length = 0
    tagsRecipes.push(...tempRecipesList)

    updatePage(tagsRecipes)

    /*
    1- ajouter le tag dans .tags__selected au click
    2- créer un array avec les id des recettes incluant cet id
    3- actualiser l'array avec cet array
    4- gérer la suppression du tag
    */


}

const createTagSelectedElement = (tag, category) => {
    const newTagSelected = document.createElement('button')
    newTagSelected.className = `tag__selected ${category}__color`
    newTagSelected.dataset.category = category
    newTagSelected.dataset.value = tag
    newTagSelected.innerHTML = `${tag} <i class="fa-regular fa-circle-xmark"></i>`
    newTagSelected.addEventListener('click', e => removeTag(e))
    $tagSelectedContainer.appendChild(newTagSelected)
}

const removeTag = e => {
    const{category, value} = e.target.dataset

    const unselectTag = document.querySelector(`.${category} .tag__btn[data-value="${value}"]`)

    unselectTag.setAttribute('aria-selected', 'false')

    tagsSelected[category].splice(tagsSelected[category].indexOf(value),1)

    e.target.remove()
}

$tagsOpener.forEach(btn => btn.addEventListener('click', e => {
    const value = e.target.parentElement.ariaExpanded === 'true' ? 'false' : 'true'
    e.target.parentElement.setAttribute('aria-expanded', value)
}))

getRecipes()