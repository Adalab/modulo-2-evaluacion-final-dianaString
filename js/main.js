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
    // console.log(TVshowsList[0].show.name)
    // ul > li > article > img y título

    for(const TVshow of TVshowsList){

        // Añadir un li
        const liElement = document.createElement('li');
        listContainer.appendChild(liElement); // listContainer = ulElement

        // Añadir un article
        const articleElement = document.createElement('article');
        // articleElement.textContent = TVshow.name;
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