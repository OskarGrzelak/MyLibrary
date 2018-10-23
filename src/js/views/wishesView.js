export default class wishesView {
    constructor() {
        this.elements = {
            wishList: document.getElementsByClassName('wish-panel__list')[0]
        }
    }

    renderWishList(wishes) {
        wishes.forEach(wish => {
            const markup = `
            <li>
                <div class="wish" id="${wish.id}">
                    <div class="wish__info">
                        <h3 class="wish__title">${wish.limitTitle(16)}</h3>
                        <p class="wish__author">${wish.author}</p>
                    </div>
                    <div class="wish__actions">
                        <ul>
                            <li class="wish__action wish__action--add">Add</li>
                            <li class="wish__action wish__action--del">Del</li>
                        </ul>
                    </div>
                </div>
            </li>
            `;
            this.elements.wishList.insertAdjacentHTML('afterbegin', markup);
        });
    }

    clearWishList() { this.elements.wishList.innerHTML = ''; }
}