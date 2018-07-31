import axios from 'axios';

// ELEMENTS

const elements = {
    openSearchPanel: document.getElementById('open-search-panel'),
    searchPanel: document.getElementsByClassName('search')[0],
    searchForm: document.getElementById('new-book-search'),
    searchTitle: document.getElementById('title'),
    searchAuthor: document.getElementById('author'),
    searchISBN: document.getElementById('isbn'),
    searchList: document.getElementById('search-list'),
    addToLib: document.getElementsByClassName('results__action--add'),
    libraryList: document.getElementsByClassName('books-panel__list')[0]
};

// SEARCH PANEL

elements.openSearchPanel.addEventListener('click', () => elements.searchPanel.classList.add('search__visible'));
elements.searchPanel.addEventListener('click', e => {
    e.target.classList.remove('search__visible');
    if (!elements.searchPanel.classList.contains('search__visible')) {
        setTimeout(clearResults, 400);
    }
});

class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
        try {
            const res = await axios(`https://www.googleapis.com/books/v1/volumes?q=${this.query}&key=AIzaSyCMh3GiKQZWIPumFfEMBEkfKebbMbOLKak`);
            this.result = res.data.items;
        } catch(err) {
            console.log(err);
        }
    }
}

const getInput = () => elements.searchTitle.value;
const clearInput = () => elements.searchTitle.value = '';
const clearResults = () => elements.searchList.innerHTML = '';

const limitTitle = (title, limit = 42) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return the result
        return `${newTitle.join(' ')} ...`;
    } 
    return title;
};

const renderResult = (result) => {
    const markup = `
        <li>
            <div class="results__item" id="${result.id}">
                <h3 class="results__title">${limitTitle(result.volumeInfo.title)}</h3>
                <p class="results__author">${result.volumeInfo.authors[0]}</p>
                    <div class="results__actions">
                        <ul>
                            <li class="results__action results__action--add">Add to lib</li>
                            <li class="results__action">Add as wish</li>
                        </ul>
                    </div>
                </div>
        </li>
    `;
    elements.searchList.insertAdjacentHTML('beforeend', markup);
};

const renderResults = (results) => {
    results.forEach(renderResult);
};

// BOOK
class Book {
    constructor(id) {
        this.id = id;
    }

    async getBook() {
        try {
            const res = await axios(`https://www.googleapis.com/books/v1/volumes/${this.id}?key=AIzaSyCMh3GiKQZWIPumFfEMBEkfKebbMbOLKak`);
            this.title = res.data.volumeInfo.title;
            this.author = res.data.volumeInfo.authors;
            this.description = res.data.volumeInfo.description;
            this.cover = res.data.volumeInfo.imageLinks.large;
        } catch (err) {
            console.log(err);
        }
    }
}

/* const book = new Book('zyTCAlFPjgYC');
book.getBook(); */

// LIBRARY
class Library {
    constructor() {
        this.books = [];
        this.num = 0;
    }

    addNewBook(id) {
        this.books.push(new Book(id));
    }

    renderLibrary(books) {
        books.forEach(book => {
            const markup = `
            <li>
                <div class="book">
                    <h3 class="book__title">${book.title}</h3>
                    <p class="book__author">${book.author}</p>
                    <p class="book__status book__status--not-readed">Not readed</p>
                    <div class="book__actions">
                        <ul>
                            <li class="book__action">More</li>
                            <li class="book__action">Change status</li>
                            <li class="book__action">Delete book</li>
                        </ul>
                    </div>
                </div>
            </li>
            `;
            elements.libraryList.insertAdjacentHTML('beforeend', markup);
        });
    }
}

const clearLibrary = () => elements.libraryList.innerHTML = '';

// CONTROLLER
const state = {};
state.library = new Library();

//control search
const controlSearch = async () => {
    // get query
    const query = getInput();

    if (query) {
        // create new search object
        state.search = new Search(query);

        // prepare UI for results
        clearInput();
        clearResults();

        try {
            // search for books
            await state.search.getResults();

            // render results
            renderResults(state.search.result);
        } catch (err) {
            console.log(err);
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

//control library
const addBookToLibrary = async (id) => {
    // create new book object
    state.library.addNewBook(id);

    try {
        await state.library.books[state.library.num].getBook();
        state.library.num++;
    } catch(err) {
        console.log(err);
    }
}

elements.searchList.addEventListener('click', async e => {
    const add = e.target.closest('.results__action--add');
    if(add) {
        elements.searchPanel.classList.remove('search__visible');
        setTimeout(clearResults, 400);
        const id = e.target.parentElement.parentElement.parentElement.id;
        await addBookToLibrary(id);
        clearLibrary();
        state.library.renderLibrary(state.library.books);
    }
});