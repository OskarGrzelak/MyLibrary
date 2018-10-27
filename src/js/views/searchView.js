import { elements } from './base';

export const getInput = () => {
    const title = elements.searchTitle.value;
    const author = elements.searchAuthor.value;
    const isbn = elements.searchISBN.value;
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
    
export const clearInput = () => {
    elements.searchTitle.value = '';
    elements.searchAuthor.value = '';
    elements.searchISBN.value = '';
}

export const clearResults = () => elements.searchList.innerHTML = '';
    
export const limitTitle = (title, limit = 42) => {
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
    
export const renderResult = (result) => {
    const markup = `
        <li>
            <div class="results__item" id="${result.id}">
                <h3 class="results__title">${limitTitle(result.volumeInfo.title)}</h3>
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
    elements.searchList.insertAdjacentHTML('beforeend', markup);
};
    
export const renderResults = (results) => {
    if(results) {
        results.forEach(result => renderResult(result));
    } else {
        alert('there are no results');
    }
};