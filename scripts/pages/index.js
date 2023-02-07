import Api from "../api/Api.js"
import Recipe from "../models/Recipe.js"
import RecipeCard from "../templates/RecipeCard.js"
import TagList from "../templates/TagList.js"

const api = new Api('data/recipes.json'),
    $recipesContainer = document.querySelector('.recipes'),
    $tagsList = Array.from(document.querySelectorAll('.tags__list')),
    ingredientsArray = [],
    applianceArray = [],
    ustensilsArray = [],
    descriptionArray = [],
    tagsArray = [{ingredients : ingredientsArray}, {appliance: applianceArray}, {ustensils: ustensilsArray}]

async function main() {

    const recipesInfos = await api.getRecipes()

    // todo : essayer de sortir l'appendchild de la boucle

    recipesInfos
        .map(recipe => new Recipe(recipe))
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

main()