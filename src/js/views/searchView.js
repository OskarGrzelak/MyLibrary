export default class Search {
    constructor() {
        this.elements = {
            openSearchPanel: document.getElementById('open-search-panel'),
            searchPanel: document.getElementsByClassName('search')[0],
            searchForm: document.getElementById('new-book-search'),
            searchTitle: document.getElementById('search-title'),
            searchAuthor: document.getElementById('search-author'),
            searchISBN: document.getElementById('search-isbn'),
            searchList: document.getElementById('search-list')
        }
    }

    getInput() {
        const title = this.elements.searchTitle.value;
        const author = this.elements.searchAuthor.value;
        const isbn = this.elements.searchISBN.value;
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
    
    clearInput() {
        this.elements.searchTitle.value = '';
        this.elements.searchAuthor.value = '';
        this.elements.searchISBN.value = '';
    }

    clearResults() { this.elements.searchList.innerHTML = ''; }
    
    limitTitle(title, limit = 42) {
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
    
    renderResult(result) {
        const markup = `
            <li>
                <div class="results__item" id="${result.id}">
                    <h3 class="results__title">${this.limitTitle(result.volumeInfo.title)}</h3>
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
        this.elements.searchList.insertAdjacentHTML('beforeend', markup);
    };
    
    renderResults(results) {
        if(results) {
        results.forEach(result => this.renderResult(result));
        } else {
            alert('there are no results');
        }
    };
}