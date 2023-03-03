import Api from "./api/Api.js"

import updatePage from "./functions/updatePage.js"
import { fillPage } from "./functions/fillPage.js"

import resetArray from "./utils/resetArray.js"

import TagButton from "./templates/TagButton.js"

const api = new Api('data/recipes.json'),
    recipes = [],// all recipes,
    filteredRecipes = { filteredBySearchBar: [], /* list of recipes filtered by words*/ filteredByTags: [] }, // list of recipes filtered by tag
    tagsSelected = { ingredients: [], appliance: [], ustensils: [] }, // tags selected
    $searchInput = document.querySelector('#search__text'),
    $tagsOpener = Array.from(document.querySelectorAll('.tags__opener')),
    $tagsSearchBar = Array.from(document.querySelectorAll('.tags__input')),
    $tagSelectedContainer = document.querySelector('.tags__selected')

let searchWordLength = 0 // length of the word in the search input

async function launchApp() {

    // GET RECIPES
    /* Getting the recipes from the API and pushing them into the recipes array. */
    recipes.push(...await api.getRecipes())

    // fill the searchbar and tags temp recipes arrays with recipes got from api
    Object.keys(filteredRecipes).forEach(filteredWay => resetArray(filteredRecipes[filteredWay], recipes))

    const { itemsInfos, $tagsBtn } = fillPage(recipes)

    Array.from(document.querySelectorAll('.tag__btn')).forEach(btn => btn.addEventListener('click', e => tagSelected(e.target)))

    // SEARCH A RECIPE
    // with search bar

    $searchInput.addEventListener('input', () => {
        /* If the length of the value of the search input is greater than 2, then triggers `filteringRecipes`.
         If not check if the recipes have already been filtered then reset the array*/
        if ($searchInput.value.length > 2) {
            filteringRecipes($searchInput.value)
        }
        else if (searchWordLength > 0) {
            searchWordLength = 0
            resetArray(filteredRecipes['filteredBySearchBar'], recipes)
            updatePage(filteredRecipes, itemsInfos, $tagsBtn)
        }
    })

    const filteringRecipes = word => {

        const searchedWord = word.toLowerCase()

        const wordLength = searchedWord.length

        /* Checking if the length of the word in the search input is greater than the length of the last searched word. If it is (letters have been erased), it resets the array. */
        searchWordLength > wordLength && resetArray(filteredRecipes['filteredBySearchBar'], recipes)
        searchWordLength = wordLength

        const tempArray = []

        filteredRecipes['filteredBySearchBar'].forEach(recipe => {
            const { name, ingredients, description } = recipe

            let myIngredients = '',
                myDescription = description.toLowerCase(),
                myName = name.toLowerCase()

            ingredients.forEach(elt => myIngredients += elt.ingredient.toLowerCase() + ' ')

            myName.match(searchedWord) ? tempArray.push(recipe) : myIngredients.match(searchedWord) ? tempArray.push(recipe) : myDescription.match(searchedWord) && tempArray.push(recipe)

        }
        )

        resetArray(filteredRecipes['filteredBySearchBar'], tempArray)

        updatePage(filteredRecipes, itemsInfos, $tagsBtn)
    }

    // TAGS SEARCH

    const tagSelected = tag => {

        //if the tag is already selected then return
        if (tag.getAttribute('aria-selected') === 'true') {
            return
        }

        tagsSelected[tag.parentElement.className].push(tag.dataset.value)
        tag.setAttribute('aria-selected', 'true')

        const newTag = new TagButton(tag.dataset.value, tag.parentElement.className)
        const $newTag = newTag.createTagButton()
        $newTag.addEventListener('click', e => removeTag(e))
        $tagSelectedContainer.appendChild($newTag)

        filteringByTag(tag.dataset.value, tag.parentElement.className)

    }

    const filteringByTag = (tag, category) => {

        filteredRecipes['filteredByTags'].length === 0 && (filteredRecipes['filteredByTags'].push(...recipes))

        const tempRecipesList = []

        itemsInfos[category][tag].forEach(id => filteredRecipes['filteredByTags'].forEach(recipe => recipe.id === id && tempRecipesList.push(recipe)))

        resetArray(filteredRecipes['filteredByTags'], tempRecipesList)

        updatePage(filteredRecipes, itemsInfos, $tagsBtn)
    }

    const removeTag = e => {

        const { category, value } = e.target.dataset

        const unselectTag = document.querySelector(`.${category} .tag__btn[data-value="${value}"]`)

        unselectTag.setAttribute('aria-selected', 'false')

        tagsSelected[category].splice(tagsSelected[category].indexOf(value), 1)

        e.target.remove()

        resetArray(filteredRecipes['filteredByTags'], recipes)

        let arraysAreEmpty = true

        Object.keys(itemsInfos).forEach(category => {
            if (tagsSelected[category].length !== 0) {
                arraysAreEmpty = false
                tagsSelected[category].forEach(tag => filteringByTag(tag, category))
            }
        })

        //if there are no tag selected
        arraysAreEmpty && updatePage(filteredRecipes, itemsInfos, $tagsBtn)
    }

    $tagsSearchBar.forEach(bar => bar.addEventListener('input', e => {
        $tagsBtn[e.target.dataset.category].forEach(btn => {
            btn.getAttribute('aria-hidden') === 'false' && (btn.style.display = btn.textContent.match(e.target.value) ? 'block' : 'none')
        })
    }))

}

launchApp()

$tagsOpener.forEach(btn => btn.addEventListener('click', e => {
    const value =  e.target.parentElement.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    $tagsOpener.forEach(list => list.parentElement.setAttribute('aria-expanded', 'false'))
    e.target.parentElement.setAttribute('aria-expanded', value)
}))