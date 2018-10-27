import { elements } from './base';
import { limitTitle } from './book';

export const renderWishList = (wishes) => {
    wishes.forEach(wish => {
        const markup = `
            <li>
                <div class="wish" id="${wish.id}">
                    <div class="wish__info">
                        <h3 class="wish__title">${limitTitle(wish, 16)}</h3>
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
        elements.wishList.insertAdjacentHTML('afterbegin', markup);
    });
};

export const clearWishList = () => elements.wishList.innerHTML = '';