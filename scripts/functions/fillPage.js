import Recipe from "../models/Recipe.js"

import RecipeCard from "../templates/RecipeCard.js"
import TagList from "../templates/TagList.js"

import checkAndCreateObject from "../utils/checkAndCreateObject.js"

export function fillPage(recipes) {

    const itemsInfos = { ingredients: {}, appliance: {}, ustensils: {} },
        $tagsBtn = {}

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

    document.querySelector('.recipes').innerHTML += recipesTemplate


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

/**
 * It takes an array of recipes, and for each recipe, it takes the name, description, and ingredients,
 * and for each of those, it splits the string into an array of words, and then it checks if the word
 * is longer than 2 characters, and if it is, it adds it to the recipesWords object.
 */
    const recipesWords = []

    const getWords = (elt, id) => {
        elt.forEach(word => {
            const wordToCheck = word.replace(/[^A-Za-zéèâàêïîç ]/g, '').toLowerCase()
            wordToCheck.length > 2 && checkAndCreateObject(recipesWords, wordToCheck, id)
        })
    }

    recipes.forEach(recipe => {
        const recipeInfos = [[recipe.name], recipe.name.split(/[\s']/), recipe.description.split(/[\s']/)]
        recipe.ingredients.forEach(ingredient => recipeInfos.push([ingredient.ingredient], ingredient.ingredient.split(/[\s']/)))
                
        recipeInfos.forEach(info => getWords(info, recipe.id))
    })

    return { recipesWords, itemsInfos, $tagsBtn }
}