import axios from 'axios';
export default class Book {
    constructor(id) {
        this.id = id;
        this.status = 'not readed';
    }

    async getBookDetails() {
        try {
            const res = await axios(`https://www.googleapis.com/books/v1/volumes/${this.id}?key=AIzaSyCMh3GiKQZWIPumFfEMBEkfKebbMbOLKak`);
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

    limitTitle(limit = 42) {
        const newTitle = [];
        if(this.title.length > limit) {
            this.title.split(' ').reduce((acc, cur) => {
                if(acc + cur.length <= limit) {
                    newTitle.push(cur);
                }
                return acc + cur.length;
            }, 0);
    
            // return the result
            return `${newTitle.join(' ')} ...`;
        } 
        return this.title;
    };

    limitDescription(limit = 700) {
        const newDescription = [];
        if (this.description.length > limit) {
            const temp = this.description.split(' ');
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
        return this.description;
    };
}