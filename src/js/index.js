import { elements } from './views/base';
import Search from './models/Search';
import Library from './models/Library';
import Wishes from './models/Wishes';
import * as searchView from './views/searchView';
import * as libraryView from './views/libraryView';
import * as wishesView from './views/wishesView';
import * as book from './views/book';
import { saveIndexedDB, loadIndexedDB, destroyIndexedDB } from './views/db';

// GLOBAL CONTROLLER

/** 
 * Global state for the app
 * search model
 * library model
 * wishes model
 * current book
 */
const state = {};

/**
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
    // get query
    const query = searchView.getInput();

    if (query) {
        // create new search object
        state.search = new Search(query);

        // prepare UI for results
        searchView.clearInput();
        searchView.clearResults();

        try {
            // search for books
            await state.search.getResults();

            // render results
            searchView.renderResults(state.search.result);
        } catch (err) {
            console.log(err);
        }
    }
}

elements.openSearchPanel.addEventListener('click', () => elements.searchPanel.classList.add('u-visible'));

elements.searchPanel.addEventListener('click', e => {
    e.target.classList.remove('u-visible');
    if (!elements.searchPanel.classList.contains('u-visible')) {
        setTimeout(() => searchView.clearResults(), 400);
    }
});

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

/**
 * LIBRARY CONTROLLER
 */

const addBookToLibrary = async (id) => {
    // create new book object
    await state.library.addNewBook(id);
}

elements.searchList.addEventListener('click', async e => {
    const add = e.target.closest('.results__action--add');
    if(add) {
        elements.searchPanel.classList.remove('u-visible');
        setTimeout(() => searchView.clearResults(), 400);
        const id = e.target.parentElement.parentElement.parentElement.id;
        await addBookToLibrary(id);
        //console.log(state.library.books);
        libraryView.clearLibrary();
        libraryView.renderLibrary(state.library.books);

        saveIndexedDB('library', state.library.books);
    }
});

elements.sortButtons.forEach(el => el.addEventListener('click', e => {
    const key = e.target.id;
    state.library.sortBooks(state.library.books, key);
    libraryView.clearLibrary();
    libraryView.renderLibrary(state.library.books);

    saveIndexedDB('library', state.library.books);
}));

elements.libraryList.addEventListener('click', e => {
    const change = e.target.closest('.book__action--change');
    if (change) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        const index = state.library.books.findIndex(el => el.id === id);
        book.changeStatus(state.library.books[index]);
        libraryView.clearLibrary();
        libraryView.renderLibrary(state.library.books);

        saveIndexedDB('library', state.library.books);
    }
});

elements.libraryList.addEventListener('click', e => {
    const del = e.target.closest('.book__action--del');
    if(del) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.library.deleteBook(id);
        libraryView.clearLibrary();
        libraryView.renderLibrary(state.library.books);

        saveIndexedDB('library', state.library.books);
    }
});

/**
 * WISHES CONTROLLER
 */

const addBookToWishList = async (id) => {
    // create new book object
    await state.wishes.addNewBook(id);
}

elements.searchList.addEventListener('click', async e => {
    const wish = e.target.closest('.results__action--wish');
    if(wish) {
        elements.searchPanel.classList.remove('u-visible');
        setTimeout(() => searchView.clearResults(), 400);
        const id = e.target.parentElement.parentElement.parentElement.id;
        await addBookToWishList(id);
        wishesView.clearWishList();
        wishesView.renderWishList(state.wishes.wishes);

        saveIndexedDB('wishes', state.wishes.wishes);
    }
});

elements.wishList.addEventListener('click', e => {
    const add = e.target.closest('.wish__action--add');
    if(add) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.wishes.moveBook(id, state.library.books);
        wishesView.clearWishList();
        libraryView.clearLibrary();
        wishesView.renderWishList(state.wishes.wishes);
        libraryView.renderLibrary(state.library.books);

        saveIndexedDB('wishes', state.wishes.wishes);
        saveIndexedDB('library', state.library.books);
    };
});

elements.wishList.addEventListener('click', e => {
    const del = e.target.closest('.wish__action--del');
    if(del) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.wishes.deleteBook(id);
        wishesView.clearWishList();
        wishesView.renderWishList(state.wishes.wishes);

        saveIndexedDB('wishes', state.wishes.wishes);
    };
});

/**
 * BOOK CONTROLLER
 */

elements.libraryList.addEventListener('click', e => {
    const show = e.target.closest('.book__action--show');
    if(show) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.currentBook = book.showBookDetails(state.library.books, id);

        elements.bookDetails.classList.add('u-visible');
    }
});

elements.bookDetails.addEventListener('click', e => {
    e.target.classList.remove('u-visible');
});

elements.changeBookStatus.addEventListener('click', () => {
    book.changeStatus(state.currentBook);
    libraryView.clearLibrary();
    libraryView.renderLibrary(state.library.books);

    saveIndexedDB('library', state.library.books);
});

elements.removeBook.addEventListener('click', () => {
    state.library.deleteBook(state.currentBook.id);
    libraryView.clearLibrary();
    libraryView.renderLibrary(state.library.books);
    elements.bookDetails.classList.remove('u-visible');

    saveIndexedDB('library', state.library.books);
});

// read data on load

window.addEventListener('load',() => {

    if (!state.library) state.library = new Library();
    if (!state.wishes) state.wishes = new Wishes();

    const getStoredData = (data) => {
        data.forEach(el => {
            el.type === 'library' ? state.library.books = el.data : state.wishes.wishes = el.data;
        });
        libraryView.renderLibrary(state.library.books);
        wishesView.renderWishList(state.wishes.wishes);
    };

    loadIndexedDB(getStoredData);
});

//destroyIndexedDB('Database');