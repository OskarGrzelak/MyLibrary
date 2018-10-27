import axios from 'axios';
import { elements } from './base';

export const getBookDetails = async (book) => {
    
    try {
        const res = await axios(`https://www.googleapis.com/books/v1/volumes/${book.id}?key=AIzaSyCMh3GiKQZWIPumFfEMBEkfKebbMbOLKak`);
        if(res.data.volumeInfo.title) {
            book.title = res.data.volumeInfo.title;
        } else {
            book.title = 'unknown title';
        };

        if(res.data.volumeInfo.authors) {
            book.author = res.data.volumeInfo.authors;
        } else {
            book.author = 'unknown author';
        };

        if(res.data.volumeInfo.description) {
            book.description = res.data.volumeInfo.description;
        } else {
            book.description = 'Sorry. There is no description avaible';
        };
        
        if(res.data.volumeInfo.imageLinks.large) {
            book.cover = res.data.volumeInfo.imageLinks.large;
        } else if(res.data.volumeInfo.imageLinks.medium) {
            book.cover = res.data.volumeInfo.imageLinks.medium;
        } else if(res.data.volumeInfo.imageLinks.small) {
            book.cover = res.data.volumeInfo.imageLinks.small;
        } else if(res.data.volumeInfo.imageLinks.thumbnail) {
            book.cover = res.data.volumeInfo.imageLinks.thumbnail;
        } else if(res.data.volumeInfo.imageLinks.smallThumbnail) {
            book.cover = res.data.volumeInfo.imageLinks.smallThumbnail;
        } else {
            book.cover = 'https://media.istockphoto.com/photos/question-mark-from-books-searching-information-or-faq-edication-picture-id508545844';
        };
    } catch (err) {
        console.log(err);
    };
};

export const changeStatus = (book) => {
    if (book.status === 'not readed') {
        book.status = 'readed';
    } else {
        book.status = 'not readed';
    };
};

export const limitTitle = (book, limit = 42) => {
    const newTitle = [];
    if(book.title.length > limit) {
        book.title.split(' ').reduce((acc, cur) => {
            if(acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;
        }, 0);

        // return the result
        return `${newTitle.join(' ')} ...`;
    } 
    return book.title;
};

const limitDescription = (book, limit = 700) => {
    const newDescription = [];
    if (book.description.length > limit) {
        const temp = book.description.split(' ');
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
    return book.description;
};

export const showBookDetails = (books, id) => {
    const index = books.findIndex(el => el.id === id);
    elements.bookTitle.textContent = books[index].title;
    elements.bookAuthor.textContent = books[index].author;
    elements.bookDescription.innerHTML = limitDescription(books[index]);
    elements.bookCover.src = books[index].cover;
    return books[index];
};