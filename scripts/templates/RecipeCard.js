export default class RecipeCard{
    constructor(recipe){
        this._recipe = recipe
    }

    createRecipeCard(){
        const $container = document.createElement('article')

        $container.classList.add('card')

        const {name, ingredients, time, description} = this._recipe

        const cardContent = `
        <div class="card__img">
        </div>
        <div class="card__text">
            <div class="card__section">            
                <p class="card__element card__name">${name}</p>
                <p class="card__element card__duration"><i class="fa-regular fa-clock"></i> ${time} min</p>
            </div>
            <div class="card__section"> 
                <p class="card__element card__ingredients">${ingredients}</p>
                <p class="card__element card__description">${description}</p>
            </div>
        </div>
        `

        $container.innerHTML = cardContent

        return $container
    }
}