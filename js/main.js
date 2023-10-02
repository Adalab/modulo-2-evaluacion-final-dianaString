'use strict'

// VARIABLES DEL HTML ------------------------------------------------------

// Buscador
const searchText = document.querySelector('.js-searchText'); 
const searchBtn = document.querySelector('.js-searchBtn');   

// Container (contenedor de las listas)
const listShowContainer = document.querySelector('.js-listShowContainer'); 
const listFavContainer = document.querySelector('.js-listFavContainer');  

// Borrar lista de favoritos
const clearAllBtn = document.querySelector('.js-clearAllBtn'); 

// ARRAYS (las listas) -----------------------------------------------------

let TVshowsList = [];      
let favoriteShowList = []; 

// LOCAL STORAGE (GET) -----------------------------------------------------    

const favoriteShowsLS = JSON.parse(localStorage.getItem("settedFavShows"));

if (favoriteShowsLS !== null) {
    favoriteShowList = favoriteShowsLS;
    renderList(listFavContainer, favoriteShowList);
    getApiData();
} else {
    getApiData();
}

// FUNCIONES ---------------------------------------------------------------

// Fetch
function getApiData(){

    const searchValue = searchText.value;
    const API_URL = `//api.tvmaze.com/search/shows?q=${searchValue}`;

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
        // ul > li > article > + img + h3
        
        const liElement = document.createElement('li');
        container.appendChild(liElement);

        const articleElement = document.createElement('article');
        articleElement.classList.add('card');
        articleElement.id = item.show.id;        
        liElement.appendChild(articleElement);

        // Si el item está en la lista de fav. añade la clase Highlight (highlightFav) 
        if (favoriteShowList.some(favshow => favshow.show.id === item.show.id)) {
            articleElement.classList.add('highlightFav');
        }

        // Si el container es el de favoritos crea un button (x)
        if(container === listFavContainer){
            const xButton = document.createElement('button');
            xButton.classList.add('xButtonStyle');
            xButton.textContent = 'x';
            xButton.id = item.show.id;      
            articleElement.appendChild(xButton);
        }

        const imgElement = document.createElement('img');
        if (item.show.image === null) {
            imgElement.src = 'https://fakeimg.pl/210x295?text=TV';
        } else {
            imgElement.src = item.show.image.medium;
        }
        articleElement.appendChild(imgElement);

        const h3Element = document.createElement('h3');
        h3Element.classList.add('showTitle');
        h3Element.textContent = item.show.name;
        articleElement.appendChild(h3Element);
    }
}

// HANDLERS ----------------------------------------------------------------

// Buscador
function handleSearch(event) {
    event.preventDefault();
    getApiData(); // para enlazar la Api con la búsqueda
    const searchValue = searchText.value;

    const filteredTVShows = TVshowsList
        .filter(TVshow => TVshow.show.name.toLowerCase()
            .includes(searchValue.toLowerCase()));

    renderList(listShowContainer, filteredTVShows);
}

// Favoritos
function handleManageFavorites(event) {

    const clickedElement = event.target; 

    const clickedArticle = clickedElement.closest('article'); // closest() -> él mismo y sus hijos
    const clickedXbtn = clickedElement.closest('button');

    if ((event.currentTarget === listShowContainer && clickedArticle) ||
        (event.currentTarget === listFavContainer && clickedXbtn)) {
            
        const clickedShowID = parseInt(clickedArticle.id);
        let foundShow = TVshowsList.find(TVshow => TVshow.show.id === clickedShowID);
        const indexFav = favoriteShowList.findIndex(TVshow => TVshow.show.id === clickedShowID);

        // selecciona en el container del listado de series aquellas que sean favoritos
        const HighlightedTVShows = listShowContainer.querySelector(`article[id="${clickedShowID}"]`);

        if (indexFav === -1) {
            favoriteShowList.unshift(foundShow);

            HighlightedTVShows.classList.add('highlightFav');

        } else {
            favoriteShowList.splice(indexFav, 1);

            if(HighlightedTVShows){ 
                HighlightedTVShows.classList.remove('highlightFav');
            }
        }
        renderList(listFavContainer, favoriteShowList); 

        // LOCAL STORAGE (SET)
        localStorage.setItem('settedFavShows', JSON.stringify(favoriteShowList));
    }
}

// Borrar todo
function handleClearAll(event) {
    event.preventDefault();

    listFavContainer.innerHTML = '';
    favoriteShowList = [];

    const highlightFavOwners = document.querySelectorAll('.highlightFav')
    highlightFavOwners.forEach(owner => owner.classList.remove('highlightFav'));

    localStorage.setItem('settedFavShows', JSON.stringify(favoriteShowList));
}

// EVENTS / LISTENERS ------------------------------------------------------
searchBtn.addEventListener('click', handleSearch);

listShowContainer.addEventListener('click', handleManageFavorites);
listFavContainer.addEventListener('click', handleManageFavorites);

clearAllBtn.addEventListener('click', handleClearAll);
