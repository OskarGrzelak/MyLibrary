import Search from './models/Search';
import searchView from './views/searchView';
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



// GLOBAL CONTROLLER

/** 
 * Global state for the app
 */
const state = {};
state.library = new Library();
state.libraryView = new libraryView();
state.wishes = new Wishes();
state.wishesView = new wishesView();
state.bookView = new bookView();
state.searchView = new searchView();

/**
 * SEARCH CONTROLLER
 */

const controlSearch = async () => {
    // get query
    const query = state.searchView.getInput();

    if (query) {
        // create new search object
        state.search = new Search(query);

        // prepare UI for results
        state.searchView.clearInput();
        state.searchView.clearResults();

        try {
            // search for books
            await state.search.getResults();

            // render results
            state.searchView.renderResults(state.search.result);
        } catch (err) {
            console.log(err);
        }
    }
}

elements.openSearchPanel.addEventListener('click', () => elements.searchPanel.classList.add('u-visible'));

elements.searchPanel.addEventListener('click', e => {
    e.target.classList.remove('u-visible');
    if (!elements.searchPanel.classList.contains('u-visible')) {
        setTimeout(() => state.searchView.clearResults(), 400);
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
     

    /* try {
        await book.getBookDetails();
    } catch(err) {
        console.log(err);
    } */
}

elements.searchList.addEventListener('click', async e => {
    const add = e.target.closest('.results__action--add');
    if(add) {
        elements.searchPanel.classList.remove('u-visible');
        setTimeout(() => state.searchView.clearResults(), 400);
        const id = e.target.parentElement.parentElement.parentElement.id;
        await addBookToLibrary(id);
        //console.log(state.library.books);
        state.libraryView.clearLibrary();
        state.libraryView.renderLibrary(state.library.books);



        if (!window.indexedDB) {
            window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        }
        
        // Let us open our database
        let request = indexedDB.open("Database", 1);
        let db, tx, store;
        request.onupgradeneeded = function(e) {
        let db = request.result;
        let store = db.createObjectStore('Collection', { keyPath: 'type' });
    };
        request.onerror = function(e) {
            console.log('error ' + e.target.errorCode);
        };
        request.onsuccess = function(e) {
            db = request.result;
            tx = db.transaction('Collection', 'readwrite');
            store = tx.objectStore('Collection');
        
            db.onerror = function(e) {
                console.log('error ' + e.target.errorCode);
            };
            console.log('adding do db');
            console.log(state.library.books);
            store.put({ type: 'library', data: state.library.books });

            tx.oncomplete = function() {
                db.close();
            };

            console.log(store);
        };
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

/**
 * WISHES CONTROLLER
 */

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
        setTimeout(() => state.searchView.clearResults(), 400);
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

/**
 * BOOK CONTROLLER
 */

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

window.addEventListener('load', () => {
    /* // read data from local storage
    state.library.readData();
    console.log(state.library.books);

    state.libraryView.renderLibrary(state.library.books); */

    if (!window.indexedDB) {
        window.alert("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    }
    
    // Let us open our database
    let request = indexedDB.open("Database", 1);
    let db, tx, store;
    request.onupgradeneeded = function(e) {
        console.log('upgrading');
        let db = request.result;
        let store = db.createObjectStore('Collection', { keyPath: 'type' });
    };
    request.onerror = function(e) {
        console.log('error ' + e.target.errorCode);
    };
    request.onsuccess = function(e) {
        console.log('success');
        db = request.result;
        tx = db.transaction('Collection', 'readwrite');
        store = tx.objectStore('Collection');
    
        db.onerror = function(e) {
            console.log('error ' + e.target.errorCode);
        };

        let retrievedData = store.get('library');

        retrievedData.onsuccess = function(e) {
            if (retrievedData.result) console.log(retrievedData);
            if (retrievedData.result) state.library.books = retrievedData.result.data;
            state.libraryView.renderLibrary(state.library.books);
            console.log(state.library.books);
        }

        //store.delete('library');

        tx.oncomplete = function() {
            db.close();
        };
    };
});

/* localStorage.removeItem('library'); */

/* var DBDeleteRequest = window.indexedDB.deleteDatabase("Database");

DBDeleteRequest.onerror = function(event) {
  console.log("Error deleting database.");
};
 
DBDeleteRequest.onsuccess = function(event) {
  console.log("Database deleted successfully");
    
  console.log(event.result); // should be undefined
}; */