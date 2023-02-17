export default class TagList {
    constructor(array) {
        this._array = array
    }

    createTagList(name) {
        const $container = document.createElement('ul')

        $container.classList.add(`${name}`)

        this._array.forEach(elt => {
            const item = `<li class="tag__btn" data-value="${elt.toLowerCase()}" aria-hidden="false" aria-selected="false" role="button">${elt}</li>`
            $container.innerHTML += item
        })

        return $container
    }
}