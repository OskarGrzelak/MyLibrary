import axios from 'axios';
import Book from './models/Book';
import bookView from './views/bookView';
import Library from './models/Library';
import libraryView from './views/libraryView';
import Wishes from './models/Wishes';
import wishesView from './views/wishesView';


// ELEMENTS

const elements = {
    openSearchPanel: document.getElementById('open-search-panel'),
    searchPanel: document.getElementsByClassName('search')[0],
    searchForm: document.getElementById('new-book-search'),
    searchTitle: document.getElementById('search-title'),
    searchAuthor: document.getElementById('search-author'),
    searchISBN: document.getElementById('search-isbn'),
    searchList: document.getElementById('search-list'),
    addToLib: document.getElementsByClassName('results__action--add'),
    delFromLib: document.getElementsByClassName('book__action--del'),
    libraryList: document.getElementsByClassName('books-panel__list')[0],
    wishList: document.getElementsByClassName('wish-panel__list')[0],
    bookDetails: document.getElementsByClassName('details')[0],
    bookTitle: document.getElementById('book-title'),
    bookAuthor: document.getElementById('book-author'),
    bookCover: document.getElementById('book-cover'),
    bookDescription: document.getElementById('book-description'),
    removeBook: document.getElementById('remove-book'),
    changeBookStatus: document.getElementById('change-status'),
    sortButtons: Array.from(document.getElementsByClassName('control-panel__action--small'))
};

// SEARCH PANEL

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

const getInput = () => {
    const title = elements.searchTitle.value;
    const author = elements.searchAuthor.value;
    const isbn = elements.searchISBN.value;
    let query = '';
    if(title) {
        query += `intitle:${title}+`;
    }
    if(author) {
        query += `inauthor:${author}+`;
    }
    if(isbn) {
        query += `isbn:${isbn}`;
    }
    return query;
}

const clearInput = () => {
    elements.searchTitle.value = '';
    elements.searchAuthor.value = '';
    elements.searchISBN.value = '';
}
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

const limitDescription = (description, limit = 700) => {
    const newDescription = [];
    if (description.length > limit) {
        const temp = description.split(' ');
        temp.reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newDescription.push(cur);
            }
            return acc + cur.length;
        }, 0);
        if (newDescription[0].indexOf('<p>') !== -1) {
            if (newDescription[newDescription.length-1].indexOf('</p>') === -1) {
                newDescription[newDescription.length-1] += ' (...)</p>';
            }
        } else {
            newDescription[newDescription.length-1] += ' (...)';
        }
        return `${newDescription.join(' ')}`;
    }
    return description;
};

const renderResult = (result) => {
    const markup = `
        <li>
            <div class="results__item" id="${result.id}">
                <h3 class="results__title">${limitTitle(result.volumeInfo.title)}</h3>
                <p class="results__author">${result.volumeInfo.authors}</p>
                    <div class="results__actions">
                        <ul>
                            <li class="results__action results__action--add">Add to lib</li>
                            <li class="results__action results__action--wish">Add as wish</li>
                        </ul>
                    </div>
                </div>
        </li>
    `;
    elements.searchList.insertAdjacentHTML('beforeend', markup);
};

const renderResults = (results) => {
    if(results) {
    results.forEach(renderResult);
    } else {
        alert('there are no results');
    }
};

// CONTROLLER
const state = {};
state.library = new Library();
state.libraryView = new libraryView();
state.wishes = new Wishes();
state.wishesView = new wishesView();
state.bookView = new bookView();

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

elements.openSearchPanel.addEventListener('click', () => elements.searchPanel.classList.add('u-visible'));
elements.searchPanel.addEventListener('click', e => {
    e.target.classList.remove('u-visible');
    if (!elements.searchPanel.classList.contains('u-visible')) {
        setTimeout(clearResults, 400);
    }
});

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

//control library
const addBookToLibrary = async (id) => {
    // create new book object
    const book = state.library.addNewBook(id);
     

    try {
        await book.getBookDetails();
    } catch(err) {
        console.log(err);
    }
}

elements.searchList.addEventListener('click', async e => {
    const add = e.target.closest('.results__action--add');
    if(add) {
        elements.searchPanel.classList.remove('u-visible');
        setTimeout(clearResults, 400);
        const id = e.target.parentElement.parentElement.parentElement.id;
        await addBookToLibrary(id);
        state.libraryView.clearLibrary();
        state.libraryView.renderLibrary(state.library.books);
    }
});

elements.sortButtons.forEach(el => el.addEventListener('click', e => {
    const key = e.target.id;
    state.library.sortBooks(state.library.books, key);
    state.libraryView.clearLibrary();
    state.libraryView.renderLibrary(state.library.books);
}));

elements.libraryList.addEventListener('click', e => {
    const change = e.target.closest('.book__action--change');
    if (change) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        const index = state.library.books.findIndex(el => el.id === id);
        state.library.books[index].changeStatus();
        state.libraryView.clearLibrary();
        state.libraryView.renderLibrary(state.library.books);
    }
});

elements.libraryList.addEventListener('click', e => {
    const del = e.target.closest('.book__action--del');
    if(del) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.library.deleteBook(id);
        state.libraryView.clearLibrary();
        state.libraryView.renderLibrary(state.library.books);
    }
});

// control wish list
const addBookToWishList = async (id) => {
    // create new book object
    const wish = state.wishes.addNewBook(id);

    try {
        await wish.getBookDetails();
    } catch(err) {
        console.log(err);
    }
}

elements.searchList.addEventListener('click', async e => {
    const wish = e.target.closest('.results__action--wish');
    if(wish) {
        elements.searchPanel.classList.remove('u-visible');
        setTimeout(clearResults, 400);
        const id = e.target.parentElement.parentElement.parentElement.id;
        await addBookToWishList(id);
        state.wishesView.clearWishList();
        state.wishesView.renderWishList(state.wishes.wishes);
    }
});

elements.wishList.addEventListener('click', e => {
    const add = e.target.closest('.wish__action--add');
    if(add) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.wishes.moveBook(id, state.library.books);
        state.wishesView.clearWishList();
        state.libraryView.clearLibrary();
        state.wishesView.renderWishList(state.wishes.wishes);
        state.libraryView.renderLibrary(state.library.books);
    }
});

elements.wishList.addEventListener('click', e => {
    const del = e.target.closest('.wish__action--del');
    if(del) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.wishes.deleteBook(id);
        state.wishesView.clearWishList();
        state.wishesView.renderWishList(state.wishes.wishes);
    }
});

// control book detail

elements.libraryList.addEventListener('click', e => {
    const show = e.target.closest('.book__action--show');
    if(show) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.currentBook = state.bookView.showBookDetails(state.library.books, id);

        elements.bookDetails.classList.add('u-visible');
    }
});

elements.bookDetails.addEventListener('click', e => {
    e.target.classList.remove('u-visible');
});

elements.changeBookStatus.addEventListener('click', () => {
    state.currentBook.changeStatus();
    state.libraryView.clearLibrary();
    state.libraryView.renderLibrary(state.library.books);
});

elements.removeBook.addEventListener('click', () => {
    state.library.deleteBook(state.currentBook.id);
    state.libraryView.clearLibrary();
    state.libraryView.renderLibrary(state.library.books);
    elements.bookDetails.classList.remove('u-visible');
});

// read data on load

/* window.addEventListener('load', () => {
    // read data from local storage
    console.log(state);
    state.library.readData();
    state.window.readData();
}); */