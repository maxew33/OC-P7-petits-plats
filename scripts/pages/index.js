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
    itemsInfos = { ingredients: {}, appliance: {}, ustensils: {} }, // key : tag, values: recipes.id
    tagsSelected = { ingredients: [], appliance: [], ustensils: [] }, // tags selected
    $tagsOpener = Array.from(document.querySelectorAll('.tags__opener')),
    $tagSelectedContainer = document.querySelector('.tags__selected')

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

    //create the card for the recipes
    recipes.map(recipe => new Recipe(recipe))
        .forEach(recipe => {
            const card = new RecipeCard(recipe)
            const myCard = card.createRecipeCard()

            recipesTemplate += myCard

            Object.keys(itemsInfos).forEach(category => {
                recipe[category + 'Array'].forEach(elt => {
                    checkAndCreateObject(itemsInfos[category], elt.toLowerCase(), recipe.id)
                })

            })

        })

    $recipesContainer.innerHTML = recipesTemplate


    //create the tags and fill the tags container
    Object.keys(itemsInfos).forEach(category => {

        // store unique tags by alphabetical order
        const listData = [... new Set(Object.keys(itemsInfos[category]).sort())]

        const categoryList = new TagList(listData)
        const itemList = categoryList.createTagList(category)

        const listContainer = document.querySelector(`.${category}__list`)

        listContainer.appendChild(itemList)
        $tagsBtn[category] = listContainer.querySelectorAll('.tag__btn')
    })

    //fill my tags buttons array with all the created tags    
    Array.from(document.querySelectorAll('.tag__btn')).forEach(btn => btn.addEventListener('click', e => tagSelected(e.target)))
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
    Object.values(itemsInfos).forEach(value => value.length = 0)

    //display the tags button, for each category, if the recipe's id linked to the button value is in the the matching recipes id array then display it
    Object.keys(itemsInfos).forEach(category => {
        $tagsBtn[category].forEach(button => {
            button.style.display = itemsInfos[category][button.dataset.value].find(elt => idArray.includes(elt)) ? 'block' : 'none'
        })
    })
}

// SEARCH A RECIPE
// with search bar

$searchInput.addEventListener('input', () => {
    /* If the length of the value of the search input is greater than 2, then it
    calls the function `filteringRecipes` with the value of the search input as the argument.
     If the length of the value of the search input is not greater than 2 and the recipes alreday been filtered then reset the array*/

    $searchInput.value.length > 2 ? filteringRecipes($searchInput.value) : filtered && (filtered = !filtered, resetArray(searchBarRecipes, recipesInfos), updatePage())

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

    updatePage()
}

// TAGS SEARCH

const tagSelected = tag => {

    //if the tag is already selected then return
    if (tag.getAttribute('aria-selected') === 'true') {
        return
    }
    
    tagsSelected[tag.parentElement.className].push(tag.dataset.value)
    tag.setAttribute('aria-selected', 'true')
    createTagSelectedElement(tag.dataset.value, tag.parentElement.className)

    filteringByTag(tag.dataset.value, tag.parentElement.className)

}

const filteringByTag = (tag, category) => {

    tagsRecipes.length === 0 && (tagsRecipes.push(...recipesInfos))

    const tempRecipesList = []

    itemsInfos[category][tag].forEach(id => tagsRecipes.forEach(recipe => recipe.id === id && tempRecipesList.push(recipe)))

    resetArray(tagsRecipes, tempRecipesList)

    updatePage()
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

    let arraysAreEmpty = true

    Object.keys(itemsInfos).forEach(category => {
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