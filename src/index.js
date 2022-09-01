import {
  forFetchPixabay,
  incrementPage,
  onTotalPages,
} from './js/forFetchPixabay';
import { createGalleryCards, gallery } from './js/createGalleryCards';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('.load-more');
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});
let searchQuery = '';

// слушаем форму поиска картинок
form.addEventListener('submit', handleSubmit);

function handleSubmit(evt) {
  evt.preventDefault();

   // обнулить page и totalPage
  // page = 1;
  // totalPage = 0;

  // Значение в инпуте
  const query = evt.target.elements;
  searchQuery = query.searchQuery.value.trim();
  console.log(query)

  // если ничего нет в инпуте - выйти
  if (searchQuery.length === 0) {
    return;
  }

  // HTTP-запрос на сервер
  forFetchPixabay(searchQuery)
    .then(({ data: { hits, totalHits } }) => {
      if (totalHits === 0) {
        Notify.info(
          'Sorry, there are no images matching your search query. Please try again.',
          {
            position: 'center-center',
            width: '700px',
            fontSize: '20px',
          }
        );
      } else {
        Notify.success(`Hooray! We found ${totalHits} images.`);
      }

      gallery.innerHTML = '';
      gallery.insertAdjacentHTML('beforeend', createGalleryCards(hits));
      lightbox.refresh();
      loadMoreBtn.classList.remove('is-hidden');
      incrementPage();

      let calcTotalPages = onTotalPages(hits.length);
      // console.log('calcTotalPages', calcTotalPages);
      if (calcTotalPages >= totalHits) {
        loadMoreBtn.classList.add('is-hidden');
        Notify.info("We're sorry, but you've reached the end of search results.")
      }
    })
    .catch(error => {
      gallery.innerHTML = '';
    });
}

 // слушаем кнопку load More
 loadMoreBtn.addEventListener('click', handleMoreClick);

  function handleMoreClick(evt) {
    forFetchPixabay(searchQuery)
      .then(({ data: { hits, totalHits } }) => {
        gallery.insertAdjacentHTML('beforeend', createGalleryCards(hits));
        lightbox.refresh();
        incrementPage();
        let calcTotalPages = onTotalPages(hits.length);
        // console.log('calcTotalPages', calcTotalPages);
        
        if (calcTotalPages >= totalHits) {
          loadMoreBtn.classList.add('is-hidden');
          Notify.info("We're sorry, but you've reached the end of search results.")
        }
      })
      .catch(error => {
        gallery.innerHTML = '';
        loadMoreBtn.classList.add('is-hidden');
      });
  }
