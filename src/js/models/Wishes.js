import { getBookDetails } from '../views/book';
export default class Wishes {
    constructor() {
        this.wishes = [];
    }

    async addNewBook(id) {
        const book = { id: id, status: 'not readed' };
        try {
            await getBookDetails(book);
        } catch(err) {
            console.log(err);
        }
        this.wishes.push(book);
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