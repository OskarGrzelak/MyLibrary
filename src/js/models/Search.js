import axios from 'axios';
export default class Search {
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