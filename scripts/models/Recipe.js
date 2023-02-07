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

    get id(){
        return(this._id)
    }

    get name(){
        return(this._name)
    }

    get servings(){
        return(this._servings)
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

    get time(){
        return(this._time)
    }

    get description(){
        return(this._description)
    }

    get descriptionArray(){
        const descriptionArray = this._description.split(' ')
        const filteredDescriptionArray = descriptionArray.filter(word => word.length > 2)
        return(filteredDescriptionArray)
    }

    get appliance(){
        return(this._appliance)
    }

    get applianceArray(){
        const applianceArray = [this._appliance]
        return(applianceArray)
    }

    get ustensilsArray(){
        const ustensilsArray = []
        this._ustensils.forEach(ustensil=> ustensilsArray.push(ustensil))
        return(ustensilsArray)
    }
}