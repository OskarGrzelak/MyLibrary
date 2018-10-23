import Book from './Book';
export default class Library {
    constructor() {
        this.books = [];
    }

    addNewBook(id) {
        const book = new Book(id);
        this.books.push(book);
        /* this.persistData(); */
        return book;
    }

    deleteBook(id) {
        const index = this.books.findIndex(el => el.id === id);
        this.books.splice(index, 1);
        /* this.persistData(); */
    }

    sortBooks(arr, key) {
        function compare(a,b) {
            if(a[key] < b[key]) {
                return 1;
            }
            if(a[key] > b[key]) {
                return -1;
            }
            return 0;
        }
        arr.sort(compare);
    }

    /* persistData() {
        localStorage.setItem('library', JSON.stringify(this.books));
    }

    readData() {
        const storage = JSON.parse(localStorage.getItem('library'));
        // restoring likes from the local storage
        if (storage) this.books = storage;
    } */
}