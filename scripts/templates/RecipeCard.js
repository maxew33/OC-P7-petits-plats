export default class RecipeCard{
    constructor(recipe){
        this._recipe = recipe
    }

    createRecipeCard(){        
        const {name, ingredients, time, description, image, id} = this._recipe

        const cardContent = `
        <article class="card" data-id=${id}>
            <img src="./assets/img/recipies/${image}" alt=${name} class="card__img">
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
            </article>
        `

        return cardContent
    }
}