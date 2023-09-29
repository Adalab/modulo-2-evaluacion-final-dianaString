'use strict'

// VARIABLES

// Del HTML
const searchText = document.querySelector('.js-searchText'); // input (texto)
const searchBtn = document.querySelector('.js-searchBtn');   // input (input)

const listContainer = document.querySelector('.js-listContainer'); // ul (contenido)

// Arrays
let TVshowsList = [];

// Url
const API_URL = 'https://api.tvmaze.com/search/shows?q=girls';

// FUNCIONES

// fetch
function getApiData(){
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            TVshowsList = data;
            // console.log('TVshowsList',TVshowsList)
            renderTVshowList(TVshowsList);
        })
};
getApiData();

// renderizar show de lista de shows
function renderTVshowList(TVshowsList){

    listContainer.textContent = '';

    // console.log(TVshowsList[0].show.name)
    // ul > li > article > img y título

    for(const TVshow of TVshowsList){

        // Añadir un li
        const liElement = document.createElement('li');
        listContainer.appendChild(liElement); // listContainer = ulElement

        // Añadir un article
        const articleElement = document.createElement('article');
        liElement.appendChild(articleElement);

        // Añadir una imagen
        const imgElement = document.createElement('img');
        if( TVshow.show.image === null ){
            imgElement.src = 'https://fakeimg.pl/210x295?text=TV'
        } else {
            imgElement.src = TVshow.show.image.medium;
        }
        articleElement.appendChild(imgElement);

        // Añadir un h3 (título)
        const h3Element = document.createElement('h3');
        h3Element.textContent = TVshow.show.name;
        articleElement.appendChild(h3Element);
    }
};


// HANDLER

// buscador
function handleClick(event){

    event.preventDefault();
    const searchValue = searchText.value;

    const filteredTVShows = TVshowsList
        .filter(TVshow => TVshow.show.name  // Filtra los nombres de los shows en TVshowsList
            .toLowerCase()                  // Llamada al método que convierte texto en minúsc.
            .includes(searchValue           // Llamada al método, ¿su parám. se encuentra en el show?
                .toLowerCase())             // Llamada de nuevo al met. minúsc. pero para el texto en searchValue
        );   

    renderTVshowList(filteredTVShows);   // en lugar de TVshowsList porque filteredTVShows muestra lo filtrado
}


// EVENT / LISTENER
searchBtn.addEventListener('click', handleClick);