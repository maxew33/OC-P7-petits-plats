export default class TagList {
    constructor(array) {
        this._array = array
    }

    createTagList(name) {
        const $container = document.createElement('ul')

        $container.classList.add(`${name}`)

        this._array.forEach(elt => {
            const item = `<li class="tag__btn" data-value="${elt}" role="button">${elt}</li>`
            $container.innerHTML += item
        })

        /* creation a list item for a maximum of 30 elements. */
        // for (let i = 0; i < 30; i++) {
        //     if (!this._array[i]) { break }
        //     const item = `<li>${this._array[i]}</li>`
        //     $container.innerHTML += item
        // }

        return $container
    }
}