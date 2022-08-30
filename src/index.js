import { forFetchPixabay } from './js/forFetchPixabay';
import { createGalleryCards, gallery } from "./js/createGalleryCards";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('#search-form');
const searchBtn = document.querySelector('button[type="submit"]');

form.addEventListener('submit', handleSubmit);

function handleSubmit(evt) {
  evt.preventDefault();

  const query = evt.target.elements;
  const searchQuery = query.searchQuery.value;
  // Значение в инпуте

  // HTTP-запрос на сервер
  forFetchPixabay(searchQuery).then(({ hits, total }) => {
    
    if (total === 0) {
      Notify.info('Sorry, there are no images matching your search query. Please try again.')
    }
    const markup = createGalleryCards(hits);

    gallery.innerHTML = '';
    gallery.insertAdjacentHTML('beforeend', markup);
  });
}


