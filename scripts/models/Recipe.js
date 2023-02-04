export default class Recipe{
    constructor(data){
        this._id = data.id
        this._name = data.name
        this._servings = data.servings
        this._ingredients = data.ingredients
        this._time = data.time
        this._description = data.description
        this._appliance = data.appliance
        this._ustensils = data.ustensils 
    }

    get ingredients(){
        let ingredients = ``
        this._ingredients.forEach(ingredient => {
            const ingredientUnit = ingredient.unit ? ingredient.unit : ""
            ingredients += `<span class="ingredient__name">${ingredient.ingredient} :</span><span> ${ingredient.quantity} ${ingredientUnit}</span><br>`
            
        })
        return(ingredients)
    }

    get ingredientsArray(){
        let ingredientsArray = []
        this._ingredients.forEach(ingredient => ingredientsArray.push(ingredient.ingredient))
        return(ingredientsArray)
    }

    get name(){
        return(this._name)
    }

    get time(){
        return(this._time)
    }

    get description(){
        return(this._description)
    }
}