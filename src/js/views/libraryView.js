import { elements } from './base';
import { limitTitle } from './book';

export const renderLibrary = (books) => {
    books.forEach(book => {
        const markup = `
            <d>
                <div class="book" id="${book.id}">
                    <div class="book__info">
                        <h3 class="book__title">${limitTitle(book, 19)}</h3>
                        <p class="book__author">${book.author}</p>
                        <p class="book__status book__status--not-readed">${book.status === 'not readed' ? 'You have not read this book yet' : 'You have read this book'}</p>
                    </div>
                    <div class="book__actions">
                        <ul>
                            <div class="book__action book__action--show">More info</div>
                            <div class="book__action book__action--change">Change status</div>
                            <div class="book__action book__action--del">Delete book</div>
                        </ul>
                    </div>
                </div>
            </li>
        `;
        elements.libraryList.insertAdjacentHTML('afterbegin', markup);
    });
};

export const clearLibrary = () => elements.libraryList.innerHTML = '';