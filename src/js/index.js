import axios from 'axios';

// ELEMENTS

const elements = {
    openSearchPanel: document.getElementById('open-search-panel'),
    searchPanel: document.getElementsByClassName('search'),
    searchForm: document.getElementById('new-book-search'),
    searchTitle: document.getElementById('title'),
    searchAuthor: document.getElementById('author'),
    searchISBN: document.getElementById('isbn'),
    searchList: document.getElementById('search-list')
};

// SEARCH PANEL

elements.openSearchPanel.addEventListener('click', () => elements.searchPanel[0].classList.add('search__visible'));
elements.searchPanel[0].addEventListener('click', e => e.target.classList.remove('search__visible'));

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

const getInput = () => elements.searchTitle.value;
const clearInput = () => elements.searchTitle.value = '';

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

const renderResult = (result) => {
    const markup = `
        <li>
            <div class="results__item">
                <h3 class="results__title">${limitTitle(result.volumeInfo.title)}</h3>
                <p class="results__author">${result.volumeInfo.authors[0]}</p>
                    <div class="results__actions">
                        <ul>
                            <li class="results__action">Add to lib</li>
                            <li class="results__action">Add as wish</li>
                        </ul>
                    </div>
                </div>
        </li>
    `;
    elements.searchList.insertAdjacentHTML('beforeend', markup);
};

const renderResults = (results) => {
    results.forEach(renderResult);
};

// CONTROLLER
const state = {};
const controlSearch = async () => {
    // get query
    const query = getInput();

    if (query) {
        // create new search object
        state.search = new Search(query);

        // prepare UI for results
        clearInput();

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

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});