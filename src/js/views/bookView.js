export default class bookView {
    constructor() {
        this.elements = {
            bookTitle: document.getElementById('book-title'),
            bookAuthor: document.getElementById('book-author'),
            bookCover: document.getElementById('book-cover'),
            bookDescription: document.getElementById('book-description')
        }
    }

    showBookDetails(books, id) {
        const index = books.findIndex(el => el.id === id);
        this.elements.bookTitle.textContent = books[index].title;
        this.elements.bookAuthor.textContent = books[index].author;
        this.elements.bookDescription.innerHTML = books[index].limitDescription();
        this.elements.bookCover.src = books[index].cover;
        return books[index];
    }
}