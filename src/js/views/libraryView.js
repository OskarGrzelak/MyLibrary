import Book from '../models/Book';
export default class libraryView {
    constructor() {
        this.elements = {
            libraryList: document.getElementsByClassName('books-panel__list')[0]
        }
    }

    renderLibrary(books) {
        books.forEach(book => {
            console.log(book);
            const markup = `
            <li>
                <div class="book" id="${book.id}">
                    <div class="book__info">
                        <h3 class="book__title">${book.limitTitle(17)}</h3>
                        <p class="book__author">${book.author}</p>
                        <p class="book__status book__status--not-readed">${book.status === 'not readed' ? 'You have not read this book yet' : 'You have read this book'}</p>
                    </div>
                    <div class="book__actions">
                        <ul>
                            <li class="book__action book__action--show">More</li>
                            <li class="book__action book__action--change">Change status</li>
                            <li class="book__action book__action--del">Delete book</li>
                        </ul>
                    </div>
                </div>
            </li>
            `;
            this.elements.libraryList.insertAdjacentHTML('afterbegin', markup);
        });
    }

    clearLibrary() {
        this.elements.libraryList.innerHTML = '';
    }
}