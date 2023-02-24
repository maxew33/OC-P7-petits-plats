export default function updatePage(filteredRecipes, itemsInfos, $tagsBtn) {

    const $noRecipeMsg = document.querySelector('.no-recipe')

    $noRecipeMsg.getAttribute('aria-selected') === 'true' && ($noRecipeMsg.setAttribute('aria-selected', 'false'), $noRecipeMsg.style.display = 'none')

    const tempRecipes = []

    console.log(filteredRecipes)

    // fill the temp recipes array with recipes in both searchBarRecipes array and tagsRecipes array
    filteredRecipes['filteredBySearchBar'].forEach(recipeSearched => filteredRecipes['filteredByTags'].find(recipe => recipe === recipeSearched && tempRecipes.push(recipe)))

    // if no recipe has matched
    tempRecipes.length === 0 && ($noRecipeMsg.setAttribute('aria-selected', 'true'))
    $noRecipeMsg.getAttribute('aria-selected') === 'true' && ($noRecipeMsg.style.display = 'block')

    //creation of the id array to store the matching recipes id
    const idArray = []

    tempRecipes.forEach(recipe => idArray.push(recipe.id))

    // update the recipes cards
    Array.from(document.querySelectorAll('.card')).forEach(card => card.style.display = idArray.includes(+card.dataset.id) ? 'block' : 'none')

    // update the recipes tags

    //display the tags button, for each category, if the recipe's id linked to the button value is in the the matching recipes id array then display it
    Object.keys(itemsInfos).forEach(category => {
        $tagsBtn[category].forEach(button => {
            button.setAttribute('aria-hidden', itemsInfos[category][button.dataset.value].find(elt => idArray.includes(elt)) ? 'false' : 'true')
        })
    })
}