import { forFetchPixabay } from './js/forFetchPixabay';
import { createGalleryCards, gallery } from './js/createGalleryCards';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
});

form.addEventListener('submit', handleSubmit);

function handleSubmit(evt) {
  evt.preventDefault();

  // Значение в инпуте
  const query = evt.target.elements;
  const searchQuery = query.searchQuery.value;

  // HTTP-запрос на сервер
  forFetchPixabay(searchQuery).then(({ data: { hits, totalHits } }) => {
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
  });
}
