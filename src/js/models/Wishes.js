import Book from './Book';
export default class Wishes {
    constructor() {
        this.wishes = [];
    }

    addNewBook(id) {
        const book = new Book(id);
        this.wishes.push(book);
        /* this.persistData(); */
        return book;
    }

    moveBook(id, books) {
        const index = this.wishes.findIndex(el => el.id === id);
        books.push(this.wishes[index]);
        this.deleteBook(id);
    }

    deleteBook(id) {
        const index = this.wishes.findIndex(el => el.id === id);
        this.wishes.splice(index, 1);
        /* this.persistData(); */
    }

    /* persistData() {
        localStorage.setItem('wishes', JSON.stringify(this.wishes));
    }
    
    readData() {
        const storage = JSON.parse(localStorage.getItem('wishes'));
        // restoring likes from the local storage
        if (storage) this.wishes = storage;
    } */
}