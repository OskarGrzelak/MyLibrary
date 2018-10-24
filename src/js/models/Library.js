import Book from './Book';
export default class Library {
    constructor() {
        this.books = [];
    }

    async addNewBook(id) {
        const book = new Book(id);
        try {
            await book.getBookDetails();
        } catch(err) {
            console.log(err);
        }
        this.books.push(book);
        this.persistData();
    }

    deleteBook(id) {
        const index = this.books.findIndex(el => el.id === id);
        this.books.splice(index, 1);
        this.persistData();
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

    persistData() {
        console.log(this.books);
        console.log(JSON.stringify(this.books));
        localStorage.setItem('library', this.books);
    }

    readData() {
        const storage = JSON.parse(localStorage.getItem('library'));
        // restoring likes from the local storage
        if (storage) this.books = storage;
    }
}