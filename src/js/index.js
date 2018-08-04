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
    delFromLib: document.getElementsByClassName('book__action--del'),
    libraryList: document.getElementsByClassName('books-panel__list')[0],
    wishList: document.getElementsByClassName('wish-panel__list')[0],
    bookDetails: document.getElementsByClassName('details')[0],
    bookTitle: document.getElementById('book-title'),
    bookAuthor: document.getElementById('book-author'),
    bookCover: document.getElementById('book-cover'),
    bookDescription: document.getElementById('book-description'),
    removeBook: document.getElementById('remove-book'),
    changeBookStatus: document.getElementById('change-status')
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

// BOOK
class Book {
    constructor(id) {
        this.id = id;
        this.status = 'not readed';
    }

    async getBook() {
        try {
            const res = await axios(`https://www.googleapis.com/books/v1/volumes/${this.id}?key=AIzaSyCMh3GiKQZWIPumFfEMBEkfKebbMbOLKak`);
            console.log(res);
            if(res.data.volumeInfo.title) {
                this.title = res.data.volumeInfo.title;
            } else {
                this.title = 'unknown title';
            };

            if(res.data.volumeInfo.authors) {
                this.author = res.data.volumeInfo.authors;;
            } else {
                this.author = 'unknown author';
            };

            if(res.data.volumeInfo.description) {
                this.description = res.data.volumeInfo.description;
            } else {
                this.description = 'Sorry. There is no description avaible';
            };
            
            if(res.data.volumeInfo.imageLinks.large) {
                this.cover = res.data.volumeInfo.imageLinks.large;
            } else if(res.data.volumeInfo.imageLinks.medium) {
                this.cover = res.data.volumeInfo.imageLinks.medium;
            } else if(res.data.volumeInfo.imageLinks.small) {
                this.cover = res.data.volumeInfo.imageLinks.small;
            } else if(res.data.volumeInfo.imageLinks.thumbnail) {
                this.cover = res.data.volumeInfo.imageLinks.thumbnail;
            } else if(res.data.volumeInfo.imageLinks.smallThumbnail) {
                this.cover = res.data.volumeInfo.imageLinks.smallThumbnail;
            } else {
                this.cover = 'https://media.istockphoto.com/photos/question-mark-from-books-searching-information-or-faq-edication-picture-id508545844';
            };
            
            console.log(this);
            
        } catch (err) {
            console.log(err);
        }
    }

    changeStatus() {
        if (this.status === 'not readed') {
            this.status = 'readed';
        } else {
            this.status = 'not readed';
        };
    } 
}

/* const book = new Book('zyTCAlFPjgYC');
book.getBook();
console.log(book);
//book.showBookDetails();
const title = book.title;
console.log(title);
elements.bookTitle.textContent = book.title;
console.log(elements.bookTitle.textContent); */

// LIBRARY
class Library {
    constructor() {
        this.books = [];
        this.num = 0;
    }

    addNewBook(id) {
        this.books.push(new Book(id));
    }

    deleteBook(id) {
        const index = this.books.findIndex(el => el.id === id);
        if(this.books.length === 1 || index === this.books.length-1) {
            this.books.pop();
        } else {
            for (let i = index; i < this.books.length-1; i++) {
                this.books[i] = this.books[i+1];
            }
            this.books.pop();
        }
        this.num--;
    }

    showBookDetails(id) {
        const index = this.books.findIndex(el => el.id === id);
        elements.bookTitle.textContent = this.books[index].title;
        elements.bookAuthor.textContent = this.books[index].author;
        elements.bookDescription.innerHTML = limitDescription(this.books[index].description);
        elements.bookCover.src = this.books[index].cover;
        state.currentBook = this.books[index];
        console.log(state.currentBook);
     }

    renderLibrary(books) {
        books.forEach(book => {
            const markup = `
            <li>
                <div class="book" id="${book.id}">
                    <div class="book__info">
                        <h3 class="book__title">${limitTitle(book.title, 17)}</h3>
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
            elements.libraryList.insertAdjacentHTML('afterbegin', markup);
        });
    }
}

const clearLibrary = () => elements.libraryList.innerHTML = '';

// WISH LIST
class WishList {
    constructor() {
        this.wishes = [];
        this.num = 0;
    }

    addNewBook(id) {
        this.wishes.push(new Book(id));
    }

    moveBook(id) {
        const index = this.wishes.findIndex(el => el.id === id);
        state.library.books.push(this.wishes[index]);
        state.library.num++;
        this.deleteBook(id);
    }

    deleteBook(id) {
        const index = this.wishes.findIndex(el => el.id === id);
        if(this.wishes.length === 1 || index === this.wishes.length-1) {
            this.wishes.pop();
        } else {
            for (let i = index; i < this.wishes.length-1; i++) {
                this.wishes[i] = this.wishes[i+1];
            }
            this.wishes.pop();
        }
        this.num--;
    }

    renderWishList(wishes) {
        wishes.forEach(wish => {
            const markup = `
            <li>
                <div class="wish" id="${wish.id}">
                    <div class="wish__info">
                        <h3 class="wish__title">${limitTitle(wish.title, 16)}</h3>
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
    }
}

const clearWishList = () => elements.wishList.innerHTML = '';

// CONTROLLER
const state = {};
state.library = new Library();
state.wishList = new WishList();

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
        elements.searchPanel.classList.remove('u-visible');
        setTimeout(clearResults, 400);
        const id = e.target.parentElement.parentElement.parentElement.id;
        await addBookToLibrary(id);
        clearLibrary();
        state.library.renderLibrary(state.library.books);
    }
});

elements.libraryList.addEventListener('click', e => {
    const change = e.target.closest('.book__action--change');
    if (change) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        const index = state.library.books.findIndex(el => el.id === id);
        state.library.books[index].changeStatus();
        clearLibrary();
        state.library.renderLibrary(state.library.books);
    }
});

elements.libraryList.addEventListener('click', e => {
    const del = e.target.closest('.book__action--del');
    if(del) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.library.deleteBook(id);
        clearLibrary();
        state.library.renderLibrary(state.library.books);
    }
});

// control wish list
const addBookToWishList = async (id) => {
    // create new book object
    state.wishList.addNewBook(id);

    try {
        await state.wishList.wishes[state.wishList.num].getBook();
        state.wishList.num++;
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
        clearWishList();
        state.wishList.renderWishList(state.wishList.wishes);
    }
});

elements.wishList.addEventListener('click', e => {
    const add = e.target.closest('.wish__action--add');
    if(add) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.wishList.moveBook(id);
        clearWishList();
        clearLibrary();
        state.wishList.renderWishList(state.wishList.wishes);
        state.library.renderLibrary(state.library.books);
    }
});

elements.wishList.addEventListener('click', e => {
    const del = e.target.closest('.wish__action--del');
    if(del) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.wishList.deleteBook(id);
        clearWishList();
        state.wishList.renderWishList(state.wishList.wishes);
    }
});

// control book detail

elements.libraryList.addEventListener('click', e => {
    const show = e.target.closest('.book__action--show');
    if(show) {
        const id = e.target.parentElement.parentElement.parentElement.id;
        state.library.showBookDetails(id);

        elements.bookDetails.classList.add('u-visible');
    }
});

elements.bookDetails.addEventListener('click', e => {
    e.target.classList.remove('u-visible');
});

elements.changeBookStatus.addEventListener('click', () => {
    state.currentBook.changeStatus();
    clearLibrary();
    state.library.renderLibrary(state.library.books);
});

elements.removeBook.addEventListener('click', () => {
    state.library.deleteBook(state.currentBook.id);
    clearLibrary();
    state.library.renderLibrary(state.library.books);
    elements.bookDetails.classList.remove('u-visible');
})