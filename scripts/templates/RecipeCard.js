export default class RecipeCard{
    constructor(recipe){
        this._recipe = recipe
    }

    createRecipeCard(){
        const $container = document.createElement('article')

        $container.classList.add('recipe', 'col-12')

        const {name, ingredients, time, description} = this._recipe

        const cardContent = `
        <div class="illus">
        </div>
        <div class="text">
            <div class="name col-5">${name}</div>
            <div class="duration col-7 text-end">${time}</div>
            <div class="ingredients col-5">${ingredients}</div>
            <div class="description col-7">${description}</div>
        </div>
        `

        $container.innerHTML = cardContent

        return $container
    }
}