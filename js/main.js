'use strict'

// VARIABLES --------------------------------

// Del HTML
const searchText = document.querySelector('.js-searchText'); // input (texto)
const searchBtn = document.querySelector('.js-searchBtn');   // input (input)

const listContainer = document.querySelector('.js-listContainer'); // ul (contenido)
const listFavorites = document.querySelector('.js-listFavorites'); // ul (favoritos)

// Arrays
let TVshowsList = [];       // Array principal (= dataAPI)
let favoriteShowList = [];  // Lista de favoritos (aparece en handleFavorite())

// FUNCIONES --------------------------------

// fetch
function getApiData(){

    // Url
    const searchValue = searchText.value; //searchText.value
    const API_URL = `//api.tvmaze.com/search/shows?q=${searchValue}`;
    console.log('API_URL', API_URL)

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            TVshowsList = data;
            // console.log('TVshowsList',TVshowsList)
            renderTVshowList(TVshowsList);
            renderFavoriteShows(favoriteShowList);
        })
};
getApiData();

// renderizar cada serie de TVshowsList
function renderTVshowList(TVshowsList){

    listContainer.textContent = '';

    // console.log(TVshowsList[0].show.name)
    // ul > li > article > img y título

    for(const TVshow of TVshowsList){

        // Añadir un li
        const liElement = document.createElement('li');
        listContainer.appendChild(liElement); // listContainer = ulElement

        // Añadir un article (card)
        const articleElement = document.createElement('article');
        articleElement.classList.add('card');
        articleElement.id = TVshow.show.id;
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
// renderizar cada serie favorita de favoriteShowList
function renderFavoriteShows(favoriteShowList){
    listFavorites.textContent = '';

    for(const favTVshow of favoriteShowList){

        // Añadir un li
        const liElement = document.createElement('li');
        listFavorites.appendChild(liElement); // listContainer = ulElement

        // Añadir un article (card)
        const articleElement = document.createElement('article');
        articleElement.classList.add('card');
        articleElement.id = favTVshow.show.id;
        liElement.appendChild(articleElement);

        // Añadir una imagen
        const imgElement = document.createElement('img');
        if( favTVshow.show.image === null ){
            imgElement.src = 'https://fakeimg.pl/210x295?text=TV'
        } else {
            imgElement.src = favTVshow.show.image.medium;  
        }
        articleElement.appendChild(imgElement);

        // Añadir un h3 (título)
        const h3Element = document.createElement('h3');
        h3Element.textContent = favTVshow.show.name;
        articleElement.appendChild(h3Element);
    }
}
// (¿refactorizar más adelante?)


// HANDLERS --------------------------------

// Buscador
function handleSearch(event){

    event.preventDefault();
    getApiData()
    const searchValue = searchText.value;

    const filteredTVShows = TVshowsList
        .filter(TVshow => TVshow.show.name  // Filtra los nombres de los shows en TVshowsList
            .toLowerCase()                  // Llamada al método que convierte texto en minúsc.
            .includes(searchValue           // Llamada al método, ¿su parám. se encuentra en el show?
                .toLowerCase())             // Llamada de nuevo al met. minúsc. pero para el texto en searchValue
        );   

    renderTVshowList(filteredTVShows);   // en lugar de TVshowsList porque filteredTVShows muestra lo filtrado
}

// Favoritos
function handleFavorite(event){

    if (event.target.closest('article')) { 
    // closest() tiene en cuenta los hijos al contrario que .tagName

        // event.target.closest('article) siempre devuelve article, independientemente del hijo
        const clickedArticle = event.target.closest('article');

        // CREAR LA LISTA DE FAVORITOS (mediante IDs) --------------

        // Obteniene el ID del elemento en el que se hizo clic
        const idShowClicked = parseInt(clickedArticle.id);

        // Busca el objeto/película en la lista de películas cuyo ID coincida con la ID de clickedArticle
        let foundShow = TVshowsList.find(TVshow => TVshow.show.id === idShowClicked); 

        // indexFav verifica si la ID aparece en la lista de favoritos, si vale -1 no se encuentra
        const indexFav = favoriteShowList.findIndex(TVshow => TVshow.show.id === idShowClicked)

        // Se rellena la lista de favoritos
        if (indexFav === -1) {
            favoriteShowList.push(foundShow);
        } else {
            favoriteShowList.splice(indexFav, 1);
        }

        // console.log('idShowClicked',idShowClicked);
        // console.log('foundShow',foundShow);
        // console.log('indexFav',indexFav);
        // console.log('favoriteShowList', favoriteShowList);

        // DESTACAR LOS FAVORITOS (en la lista) --------------------
        
        if(!clickedArticle.classList.contains('favoriteStyle') &&
        indexFav === -1){ // para evitar que se destaque cuando no debe
                          // aunque los destacados aún no se mantienen al hacer nueva búsqueda
            clickedArticle.classList.add('favoriteStyle')
        } else { clickedArticle.classList.remove('favoriteStyle')}
        
        console.log('indexFav',indexFav);

    }
    renderFavoriteShows(favoriteShowList)
}

// EVENT / LISTENER
searchBtn.addEventListener('click', handleSearch);
listContainer.addEventListener('click', handleFavorite);