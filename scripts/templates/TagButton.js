export default class TagButton {
    constructor(tag, category) {
        this._tag = tag
        this._category = category
    }

    createTagButton() {
        const $newTag = document.createElement('button')
        $newTag.className = `tag__selected ${this._category}__color`
        $newTag.dataset.category = this._category
        $newTag.dataset.value = this._tag
        $newTag.innerHTML = `${this._tag} <i class="fa-regular fa-circle-xmark"></i>`

        return $newTag
    }
}