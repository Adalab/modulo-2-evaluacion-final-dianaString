'use strict'

// VARIABLES --------------------------------

// Del HTML
const searchText = document.querySelector('.js-searchText'); // input (texto)
const searchBtn = document.querySelector('.js-searchBtn');   // input (input)

const listShowContainer = document.querySelector('.js-listShowContainer'); // ul (contenido)
const listFavContainer = document.querySelector('.js-listFavContainer'); // ul (favoritos)

// Arrays
let TVshowsList = [];       // Array principal (= dataAPI)
let favoriteShowList = [];  // Lista de favoritos (aparece en handleFavorite())


// LOCAL STORAGE (GET) ---------------------------                              

const favoriteShowsLS = JSON.parse(localStorage.getItem("settedFavShows"));

if(favoriteShowsLS !== null){
    favoriteShowList = favoriteShowsLS; 
    renderList(listFavContainer, favoriteShowList);
    getApiData();
}else{
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
        // Crear un li
        const liElement = document.createElement('li');
        container.appendChild(liElement);

        // Crear un article (card)
        const articleElement = document.createElement('article');
        articleElement.classList.add('card');
        articleElement.id = item.show.id;
        liElement.appendChild(articleElement);

        // Crear una imagen
        const imgElement = document.createElement('img');
        if (item.show.image === null) {
            imgElement.src = 'https://fakeimg.pl/210x295?text=TV';
        } else {
            imgElement.src = item.show.image.medium;
        }
        articleElement.appendChild(imgElement);

        // Crear un h3 (título)
        const h3Element = document.createElement('h3');
        h3Element.textContent = item.show.name;
        articleElement.appendChild(h3Element);
    }
}

// HANDLERS --------------------------------

// Buscador
function handleSearch(event){
    
    event.preventDefault();
    getApiData()
    const searchValue = searchText.value;

    const filteredTVShows = TVshowsList
        .filter(TVshow => TVshow.show.name  // Filtra los nombres de los shows en TVshowsList
            .toLowerCase()                  // Llama al método que convierte texto en minúsc.
            .includes(searchValue           // Llama al método, ¿su parám. se encuentra en el show?
                .toLowerCase())             // Llama de nuevo al met. minúsc. -> texto en searchValue
        );   

    renderList(listShowContainer, filteredTVShows);
    // en lugar de TVshowsList porque filteredTVShows muestra lo filtrado
}

// Favoritos
function handleFavorite(event){

    // closest() tiene en cuenta los hijos al contrario que .tagName
    if (event.target.closest('article')) { 

      // event.target.closest('article) siempre devuelve article, independientemente del hijo
      const clickedArticle = event.target.closest('article');

      // CREAR LA LISTA DE FAVORITOS (mediante IDs) --------------

      const idShowClicked = parseInt(clickedArticle.id);

      // Busca el objeto/TVshow en la lista de películas cuyo ID coincida con la ID de clickedArticle
      let foundShow = TVshowsList.find(TVshow => TVshow.show.id === idShowClicked); 

      // indexFav verifica si la ID aparece en la lista de favoritos, si vale -1 no se encuentra
      const indexFav = favoriteShowList.findIndex(TVshow => TVshow.show.id === idShowClicked)

      // Se rellena la lista de favoritos
      if (indexFav === -1) {
          favoriteShowList.push(foundShow);
      } else {
          favoriteShowList.splice(indexFav, 1);
      }

      // DESTACAR LOS FAVORITOS (en la lista) --------------------
      
      if(!clickedArticle.classList.contains('favoriteStyle') && indexFav === -1){ 
                            // para evitar que se destaque cuando no debe
                            // aunque los destacados aún no se mantienen al hacer nueva búsqueda
          clickedArticle.classList.add('favoriteStyle')
      } else { clickedArticle.classList.remove('favoriteStyle')}
      
    }
    renderList(listFavContainer, favoriteShowList);

    console.log('favoriteShowList', favoriteShowList);

    // LOCAL STORAGE (SET) -----------------------------------------
    localStorage.setItem('settedFavShows', JSON.stringify(favoriteShowList))        
}


// EVENT / LISTENER ------------------------
searchBtn.addEventListener('click', handleSearch);
listShowContainer.addEventListener('click', handleFavorite);