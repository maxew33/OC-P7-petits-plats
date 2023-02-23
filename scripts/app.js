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

let filtered = false // if the recipes have already been filtered

async function launchApp() {

    // GET RECIPES
    /* Getting the recipes from the API and pushing them into the recipes array. */
    recipes.push(...await api.getRecipes())

    // fill the searchbar and tags temp recipes arrays with recipes got from api
    Object.keys(filteredRecipes).forEach(filteredWay => resetArray(filteredRecipes[filteredWay], recipes))

    const { recipesWords, itemsInfos, $tagsBtn } = fillPage(recipes)

    const recipesWordsSorted = [...Object.keys(recipesWords).sort()]
    console.log(recipesWordsSorted)

    Array.from(document.querySelectorAll('.tag__btn')).forEach(btn => btn.addEventListener('click', e => tagSelected(e.target)))

    // SEARCH A RECIPE
    // with search bar

    $searchInput.addEventListener('input', () => {
        /* If the length of the value of the search input is greater than 2, then triggers `filteringRecipes`.
         If not check if the recipes have already been filtered then reset the array*/

        $searchInput.value.length > 2 ? filteringRecipes($searchInput.value) : filtered && (filtered = !filtered, resetArray(filteredRecipes['filteredBySearchBar'], recipes), updatePage(filteredRecipes, itemsInfos, $tagsBtn))
    })

    const filteringRecipes = word => {

        !filtered && (filtered = true)

        const searchedWord = word.toLowerCase()
        const wordLength = searchedWord.length

        console.log(typeof(recipesWordsSorted))

        recipesWordsSorted.forEach(word => console.log(word.slice(0, wordLength)))

        let start = 0,
        end = recipesWordsSorted.length,
        wordPlace = -1,
        i = 0

        while(start < end){
            i++
            const mid = Math.floor(start + (end-start)/2)
            const recipeWord = recipesWordsSorted[mid].slice(0, wordLength)  
            console.log(searchedWord, recipeWord)          
            if(recipeWord === searchedWord){
                start = end
                wordPlace = mid
                console.log('found', i)
            }
            else if(recipeWord > searchedWord){
                console.log('trop')
                end = mid - 1 
            }
            else{
                console.log('pas assez')
                start = mid + 1
            }
            
        console.log(start, end)
        }


        console.log(wordPlace, recipesWordsSorted[wordPlace])

        const tempArray = []

        recipesWords[recipesWordsSorted[wordPlace]].forEach(id => filteredRecipes['filteredByTags'].forEach(recipe => recipe.id === id && tempArray.push(recipe)))

        /*recipes.forEach(recipe => {
            const { name, ingredients, description } = recipe

            let myIngredients = '',
                myDescription = description.toLowerCase(),
                myName = name.toLowerCase()

            ingredients.forEach(elt => myIngredients += elt.ingredient.toLowerCase() + ' ')

            myName.match(searchedWord) ? tempArray.push(recipe) : myIngredients.match(searchedWord) ? tempArray.push(recipe) : myDescription.match(searchedWord) && tempArray.push(recipe)

        }
        )*/



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
    const value = e.target.parentElement.ariaExpanded === 'true' ? 'false' : 'true'
    $tagsOpener.forEach(list => list.parentElement.setAttribute('aria-expanded', 'false'))
    e.target.parentElement.setAttribute('aria-expanded', value)
}))