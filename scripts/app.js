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

    // get all the recipes id
    const recipesId = []
    Object.keys(recipes).forEach(key => recipesId.push(recipes[key].id))

    // fill the searchbar and tags temp recipes arrays with recipes id
    Object.keys(filteredRecipes).forEach(filteredWay => resetArray(filteredRecipes[filteredWay], recipesId))

    const { recipesWords, itemsInfos, $tagsBtn } = fillPage(recipes)

    // get all the recipes words sorted in a single array with a locale compare to ignore the diacritics
    const recipesWordsSorted = [...Object.keys(recipesWords).sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))]
    
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
            resetArray(filteredRecipes['filteredBySearchBar'], recipesId)
            updatePage(filteredRecipes, itemsInfos, $tagsBtn)
        }
    })

    const filteringRecipes = word => {

        const searchedWord = word.toLowerCase()
        const wordLength = searchedWord.length

        searchWordLength > wordLength && resetArray(filteredRecipes['filteredBySearchBar'], recipesId)

        searchWordLength = wordLength

        const tempArray = []

        let start = 0,
            end = recipesWordsSorted.length,
            recipeWord,
            found = false

        while (start < end && found === false) {
            const mid = Math.floor(start + (end - start) / 2)

            recipeWord = recipesWordsSorted[mid].slice(0, wordLength)

            let wordComparison = recipeWord.localeCompare(searchedWord, 'fr', { sensitivity: 'base' })

            if (wordComparison === 0) {
                found = true

                tempArray.push(...recipesWords[recipesWordsSorted[mid]])

                // looking for the set of all the matching words
                start = mid - 1
                while (recipesWordsSorted[start].slice(0, wordLength).localeCompare(searchedWord, 'fr', { sensitivity: 'base' }) === 0) {
                    tempArray.push(...recipesWords[recipesWordsSorted[start]])
                    start--
                }

                end = mid + 1
                while (recipesWordsSorted[end].slice(0, wordLength).localeCompare(searchedWord, 'fr', { sensitivity: 'base' }) === 0) {
                    tempArray.push(...recipesWords[recipesWordsSorted[end]])
                    end++
                }
            }

            else {
                wordComparison < 0 ? start = mid + .5 : end = mid - .5
            }
        }

        const idList = [... new Set(tempArray)]

        resetArray(filteredRecipes['filteredBySearchBar'], idList)

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

        filteredRecipes['filteredByTags'].length === 0 && (filteredRecipes['filteredByTags'].push(...recipesId))

        const tempRecipesList = []

        itemsInfos[category][tag].forEach(tagId => filteredRecipes['filteredByTags'].includes(tagId) && tempRecipesList.push(tagId))

        resetArray(filteredRecipes['filteredByTags'], tempRecipesList)

        updatePage(filteredRecipes, itemsInfos, $tagsBtn)
    }

    const removeTag = e => {

        const { category, value } = e.target.dataset

        const unselectTag = document.querySelector(`.${category} .tag__btn[data-value="${value}"]`)

        unselectTag.setAttribute('aria-selected', 'false')

        tagsSelected[category].splice(tagsSelected[category].indexOf(value), 1)

        e.target.remove()

        resetArray(filteredRecipes['filteredByTags'], recipesId)

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
    const value = e.target.parentElement.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
    $tagsOpener.forEach(list => list.parentElement.setAttribute('aria-expanded', 'false'))
    e.target.parentElement.setAttribute('aria-expanded', value)
}))