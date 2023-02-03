export default class Api {
    constructor(url) {
        this._url = url
    }

    async getRecipes() {
        return fetch(this._url)
            .then(res => res.json())
            .then(res => res.recipes)
            .catch(err => console.error('an error occurs', err))
    }
}