import Api from "../api/Api.js"
import Recipe from "../models/Recipe.js"
import RecipeCard from "../templates/RecipeCard.js"
import TagList from "../templates/TagList.js"
import checkAndCreateObject from "../utils/checkAndCreateObject.js"

import resetArray from "../utils/resetArray.js"

const api = new Api('data/recipes.json'),
    recipesInfos = [],// all recipes
    tempRecipes = [],// recipes temp array
    searchBarRecipes = [], // list of recipes filtered by words
    tagsRecipes = [], // list of recipes filtered by tag
    $recipesContainer = document.querySelector('.recipes'),
    $tagsBtn = {},
    $searchInput = document.querySelector('#search__text'),
    $noRecipeMsg = document.querySelector('.no-recipe'),
    recipesTags = [], // 
    tagsArray = { ingredients: [], appliance: [], ustensils: [] }, // tags that can be selected    
    tagsSelected = { ingredients: [], appliance: [], ustensils: [] }, // tags selected
    $tagsOpener = Array.from(document.querySelectorAll('.tags__opener')),
    $tagSelectedContainer = document.querySelector('.tags__selected'),
    tagsRecipesIdArray = {} // key : tag, values: recipes.id

let filtered = false, // if the recipes have already been filtered
    noRecipeMsgDisplayed = false


// GET RECIPES

async function getRecipes() {

    /* Getting the recipes from the API and pushing them into the recipesInfos and the temp recipes array. */
    recipesInfos.push(...await api.getRecipes())

    // fill the temp recipes arrays with recipes got from api
    resetArray(tagsRecipes, recipesInfos)
    resetArray(searchBarRecipes, recipesInfos)

    fillPage(recipesInfos)
}

// CREATE ALL THE DOM ELEMENTS (REICPES AND TAGS)

const fillPage = recipes => {

    let recipesTemplate = ''
    const tempTagsArray = {}

    //create the card for the recipes
    recipes.map(recipe => new Recipe(recipe))
        .forEach(recipe => {
            const card = new RecipeCard(recipe)
            const myCard = card.createRecipeCard()

            recipesTemplate += myCard


            //PARTIE A REFACTO

            Object.keys(tagsArray).forEach(category => {
                // fill tagsRecipesIdArray
                recipe[category + 'Array'].forEach(elt => {
                    checkAndCreateObject(tagsRecipesIdArray, elt.toLowerCase(), recipe.id)
                    checkAndCreateObject(tempTagsArray, category, elt.toLowerCase())
                })

            })

            const recipeTags = { id: recipe.id, ingredients: recipe.ingredientsArray, ustensils: recipe.ustensilsArray, appliance: recipe.applianceArray }
            recipesTags.push(recipeTags)
        })

    $recipesContainer.innerHTML = recipesTemplate


    //create the tags and fill the tags container
    Object.keys(tagsArray).forEach(category => {

        // store unique tags
        tagsArray[category] = [... new Set(tempTagsArray[category])]

        const myListData = new TagList(tagsArray[category])
        const myList = myListData.createTagList(category)

        const listContainer = document.querySelector(`.${category}__list`)

        listContainer.appendChild(myList)
        $tagsBtn[category] = listContainer.querySelectorAll('.tag__btn')
    })

    //fill my tags buttons array with all the created tags    
    Array.from(document.querySelectorAll('.tag__btn')).forEach(btn => btn.addEventListener('click', e => tagClicked(e)))

    console.log($tagsBtn)
}



// fill the arrays

const fillArrays = (arrayValues, arrayToFill) => {
    arrayValues.forEach(elt => {
        arrayToFill.indexOf(elt.toLowerCase()) === -1 && arrayToFill.push(elt.toLowerCase())
    })
}

// UPDATE THE PAGE WITH THE FILTERED DATA (RECIPE / TAGS)

const updatePage = () => {

    noRecipeMsgDisplayed && (noRecipeMsgDisplayed = false, $noRecipeMsg.style.display = 'none')

    tempRecipes.length = 0

    // fill the temp recipes array with recipes in both searchBarRecipes array and tagsRecipes array
    searchBarRecipes.forEach(recipeSearched => tagsRecipes.find(recipe => recipe === recipeSearched && tempRecipes.push(recipe)))

    // if no recipe has matched
    tempRecipes.length === 0 && (noRecipeMsgDisplayed = true)
    noRecipeMsgDisplayed && ($noRecipeMsg.style.display = 'block')

    //creation of the id array to store the matching recipes id
    const idArray = []

    tempRecipes.forEach(recipe => idArray.push(recipe.id))

    // update the recipes cards
    Array.from(document.querySelectorAll('.card')).forEach(card => card.style.display = idArray.includes(+card.dataset.id) ? 'block' : 'none')

    // update the recipes tags
    //clear the tags array
    console.log(tagsArray, tagsRecipesIdArray)
    Object.values(tagsArray).forEach(value => value.length = 0)

    //fill the arrays
    /*tempRecipes.forEach(recipe => {

        const myRecipe = recipesTags.find(tag => tag.id === recipe.id)

        Object.keys(tagsArray).forEach(category => {
            fillArrays(myRecipe[category], tagsArray[category])
        }
        )
    })*/

    //display the tags button, for each category, if the recipe's id linked to the button value is in the the matching recipes id array then display it
    Object.keys(tagsArray).forEach(category => {
        $tagsBtn[category].forEach(button => {
            button.style.display = tagsRecipesIdArray[button.dataset.value].find(elt => idArray.includes(elt)) ? 'block' : 'none'
        })
    })

    /*Object.keys(tagsRecipesIdArray).forEach(tag => {
        idArray.forEach(id => {
            tagsRecipesIdArray[tag].find(elt => elt === id) && console.log('yeees',tag)
        }
            )
    })*/

}

// SEARCH A RECIPE
// with search bar

$searchInput.addEventListener('input', () => {
    /* If the length of the value of the search input is greater than 2, then it
    calls the function `filteringRecipes` with the value of the search input as the argument.
     If the length of the value of the search input is not greater than 2 and the recipes alreday been filtered then reset the array*/

    $searchInput.value.length > 2 ? filteringRecipes($searchInput.value) : filtered && (filtered = !filtered, resetArray(searchBarRecipes, recipesInfos), updatePage())

    // $searchInput.value.length > 2 ? filteringRecipes($searchInput.value) : filtered && (filtered = !filtered, searchBarRecipes.length = 0, searchBarRecipes.push(...recipesInfos), updatePage(recipesInfos))
})

const filteringRecipes = word => {

    !filtered && (filtered = true)

    const searchedWord = word.toLowerCase()

    const tempArray = []

    recipesInfos.forEach(recipe => {
        const { name, ingredients, description } = recipe

        let myIngredients = '',
            myDescription = description.toLowerCase(),
            myName = name.toLowerCase()

        ingredients.forEach(elt => myIngredients += elt.ingredient.toLowerCase() + ' ')

        if (myName.match(searchedWord)) {
            tempArray.push(recipe)
        }
        else if (myIngredients.match(searchedWord)) {
            tempArray.push(recipe)
        }
        else if (myDescription.match(searchedWord)) {
            tempArray.push(recipe)
        }
    }
    )

    resetArray(searchBarRecipes, tempArray)

    /*searchBarRecipes.length = 0
    searchBarRecipes.push(...tempArray)*/

    // fillPage(tempRecipes)
    updatePage()
    // displayTags(tempRecipes)
}


// TAGS SEARCH

const tagClicked = e => {
    // tagsSelected.Object.keys(e.target.parentElement.className).push(e.target.dataset.value)


    //if the tag is already selected then return
    if (e.target.getAttribute('aria-selected') === 'true') {
        return
    }

    //set the style of the clicked tag and add it in the tags container
    Object.keys(tagsSelected).forEach(tagCategory => {
        if (tagCategory === e.target.parentElement.className) {
            tagsSelected[tagCategory].push(e.target.dataset.value)
            e.target.setAttribute('aria-selected', 'true')
            createTagSelectedElement(e.target.dataset.value, tagCategory)
        }
    })

    /*tagsRecipes.length === 0 && (tagsRecipes.push(...recipesInfos))

    const tempRecipesList = []

    tagsRecipesIdArray[e.target.dataset.value].forEach(id => tagsRecipes.forEach(recipe => recipe.id === id && tempRecipesList.push(recipe)))


    tagsRecipes.length = 0
    tagsRecipes.push(...tempRecipesList)

    updatePage(tagsRecipes)*/

    filteringByTag(e)

    /*
    1- ajouter le tag dans .tags__selected au click
    2- créer un array avec les id des recettes incluant cet id
    3- actualiser l'array avec cet array
    4- gérer la suppression du tag
    */


}

const filteringByTag = elt => {

    const tag = elt.target.dataset.value ? elt.target.dataset.value : elt

    tagsRecipes.length === 0 && (tagsRecipes.push(...recipesInfos))

    const tempRecipesList = []

    console.log(tagsRecipesIdArray)

    tagsRecipesIdArray[tag].forEach(id => tagsRecipes.forEach(recipe => recipe.id === id && tempRecipesList.push(recipe)))

    resetArray(tagsRecipes, tempRecipesList)

    updatePage()

    console.log(elt.target.parentElement.className)

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
    const { category, value } = e.target.dataset

    const unselectTag = document.querySelector(`.${category} .tag__btn[data-value="${value}"]`)

    unselectTag.setAttribute('aria-selected', 'false')

    tagsSelected[category].splice(tagsSelected[category].indexOf(value), 1)

    e.target.remove()

    resetArray(tagsRecipes, recipesInfos)
    /*tagsRecipes.length = 0
    tagsRecipes.push(...recipesInfos)*/

    let arraysAreEmpty = true

    Object.keys(tagsArray).forEach(category => {
        if (tagsSelected[category].length !== 0) {
            arraysAreEmpty = false
            tagsSelected[category].forEach(tag => filteringByTag(tag))
        }
    })

    //if there are no tag selected
    arraysAreEmpty && updatePage()
}

$tagsOpener.forEach(btn => btn.addEventListener('click', e => {
    const value = e.target.parentElement.ariaExpanded === 'true' ? 'false' : 'true'
    e.target.parentElement.setAttribute('aria-expanded', value)
}))

getRecipes()