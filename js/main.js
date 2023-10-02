'use strict'

// VARIABLES --------------------------------

// Del HTML
const searchText = document.querySelector('.js-searchText'); // input (texto)
const searchBtn = document.querySelector('.js-searchBtn');   // input (input)

const listShowContainer = document.querySelector('.js-listShowContainer'); // ul
const listFavContainer = document.querySelector('.js-listFavContainer');   // ul

const clearAllBtn = document.querySelector('.js-clearAllBtn'); // input (clearAll)

// Arrays (Listas)
let TVshowsList = [];      
let favoriteShowList = []; 


// LOCAL STORAGE (GET) ---------------------------                             

const favoriteShowsLS = JSON.parse(localStorage.getItem("settedFavShows"));

if (favoriteShowsLS !== null) {
    favoriteShowList = favoriteShowsLS;
    renderList(listFavContainer, favoriteShowList);
    getApiData();
} else {
    getApiData();
}


// FUNCIONES -------------------------------------

// fetch
function getApiData(){
    // Url
    const searchValue = searchText.value;
    const API_URL = `//api.tvmaze.com/search/shows?q=${searchValue}`;
    //console.log('API_URL', API_URL)
    fetch(API_URL)
        .then((response) => response.json())
        .then((dataAPI) => {
            TVshowsList = dataAPI;
            renderList(listShowContainer, TVshowsList);
    });
}

// Renderiza cualquier lista: TVshowsList, filteredTVShows o favoriteShowList
function renderList(container, itemList) {
    container.textContent = '';

    for (const item of itemList) {
        
        // Crea un li
        const liElement = document.createElement('li');
        container.appendChild(liElement);

        // Crea un article (card)
        const articleElement = document.createElement('article');
        articleElement.classList.add('card');
        articleElement.id = item.show.id;
        liElement.appendChild(articleElement);

        if (favoriteShowList.some(Favshow => Favshow.show.id === item.show.id)) {
            articleElement.classList.add('favoriteStyle');
        }

        // Crea un button (x)
        if(container === listFavContainer){
            const xButton = document.createElement('button');
            xButton.classList.add('xButtonStyle');
            xButton.textContent = 'x';
            xButton.id = item.show.id;
            articleElement.appendChild(xButton);

            xButton.addEventListener('click', () => {
                const li = xButton.closest('li');
                const idFavClicked = parseInt(xButton.id);
            
                favoriteShowList = favoriteShowList.filter(Favshow => Favshow.show.id !== idFavClicked);

                const isFavorite = favoriteShowList.some(Favshow => Favshow.show.id === idFavClicked);
                const articleInShowContainer = listShowContainer.querySelector(`article[id="${idFavClicked}"]`);

                if (articleInShowContainer && !isFavorite) {
                    articleInShowContainer.classList.remove('favoriteStyle');
                }

                li.remove();
            
                // LOCAL STORAGE (SET) -----------------
                localStorage.setItem('settedFavShows', JSON.stringify(favoriteShowList)) 
            })
        }

        // Crea una imagen
        const imgElement = document.createElement('img');
        if (item.show.image === null) {
            imgElement.src = 'https://fakeimg.pl/210x295?text=TV';
        } else {
            imgElement.src = item.show.image.medium;
        }
        articleElement.appendChild(imgElement);

        // Crea un h3 (título)
        const h3Element = document.createElement('h3');
        h3Element.textContent = item.show.name;
        articleElement.appendChild(h3Element);

    }
}

// HANDLERS --------------------------------

// Buscador
function handleSearch(event) {
    event.preventDefault();
    getApiData();
    const searchValue = searchText.value;

    const filteredTVShows = TVshowsList
        .filter(TVshow => TVshow.show.name.toLowerCase()
            .includes(searchValue.toLowerCase()));

    renderList(listShowContainer, filteredTVShows);
}

// Favoritos
function handleFavorite(event){
   
    if (event.target.closest('article')) {
        const clickedArticle = event.target.closest('article');
        const articleElements = listShowContainer.querySelectorAll('article');

        // CREA LA LISTA DE FAVORITOS (mediante IDs) --------------

        const idShowClicked = parseInt(clickedArticle.id);
        const foundShow = TVshowsList.find(TVshow => TVshow.show.id === idShowClicked);
        const indexFav = favoriteShowList.findIndex(TVshow => TVshow.show.id === idShowClicked);

            if (indexFav === -1) {
                favoriteShowList.unshift(foundShow);
                foundShow.isFavorite = true;
            } else {
                favoriteShowList.splice(indexFav, 1);
                foundShow.isFavorite = false;
            }

            if (foundShow.isFavorite) {
                clickedArticle.classList.add('favoriteStyle');
            } else {
                clickedArticle.classList.remove('favoriteStyle');
            }

        console.log(foundShow.isFavorite);

        renderList(listFavContainer, favoriteShowList); 

        // LOCAL STORAGE (SET)
        localStorage.setItem('settedFavShows', JSON.stringify(favoriteShowList));
    }   
}

function handleClearAll(event) {
    event.preventDefault();

    listFavContainer.innerHTML = '';
    favoriteShowList = [];

    const favoriteStyleOwners = document.querySelectorAll('.favoriteStyle')
    favoriteStyleOwners.forEach(owner => {
        owner.classList.remove('favoriteStyle');
    });

    localStorage.setItem('settedFavShows', JSON.stringify(favoriteShowList));
}

// EVENT / LISTENER ------------------------
searchBtn.addEventListener('click', handleSearch);
listShowContainer.addEventListener('click', handleFavorite);
clearAllBtn.addEventListener('click', handleClearAll);
//clearAll