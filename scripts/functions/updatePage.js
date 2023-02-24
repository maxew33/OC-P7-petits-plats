export default function updatePage(filteredRecipes, itemsInfos, $tagsBtn) {

    const $noRecipeMsg = document.querySelector('.no-recipe')

    $noRecipeMsg.getAttribute('aria-hidden') === 'false' && $noRecipeMsg.setAttribute('aria-hidden', 'true')

    const tempRecipes = []

    // fill the temp recipes array with recipes in both searchBarRecipes array and tagsRecipes array
    filteredRecipes['filteredBySearchBar'].forEach(recipeSearched => filteredRecipes['filteredByTags'].includes(recipeSearched) && tempRecipes.push(recipeSearched))

    // if no recipe has matched
    tempRecipes.length === 0 && ($noRecipeMsg.setAttribute('aria-hidden', 'false'))

    //creation of the id array to store the matching recipes id

    // update the recipes cards
    Array.from(document.querySelectorAll('.card')).forEach(card => card.style.display = tempRecipes.includes(+card.dataset.id) ? 'block' : 'none')

    // update the recipes tags

    //display the tags button, for each category, if the recipe's id linked to the button value is in the the matching recipes id array then display it
    Object.keys(itemsInfos).forEach(category => {
        $tagsBtn[category].forEach(button => {
            button.setAttribute('aria-hidden', itemsInfos[category][button.dataset.value].find(elt => tempRecipes.includes(elt)) ? 'false' : 'true')
        })
    })
}