import {
  forFetchPixabay,
  onTotalPages,
  onePage,
  zeroTotalPages,
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

async function handleSubmit(evt) {
  evt.preventDefault();

  // Значение в инпуте
  const query = evt.target.elements;
  searchQuery = query.searchQuery.value.trim();

  // если ничего нет в инпуте - выйти
  if (searchQuery.length === 0) {
    return;
  }

  // вернем page = 1
  onePage();
  // вернем totalPage = 0
  zeroTotalPages();

  // HTTP-запрос на сервер
  const {
    data: { hits, totalHits },
  } = await forFetchPixabay(searchQuery);

  try {
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
      Notify.success(`Hooray! We found ${totalHits} images.`, {
        position: 'center-bottom',
      });
    }
    gallery.innerHTML = '';
    gallery.insertAdjacentHTML('beforeend', createGalleryCards(hits));
    lightbox.refresh();
    loadMoreBtn.classList.remove('is-hidden');

    // плавный скрол вниз после первой загрузки!
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 0.2,
      behavior: 'smooth',
    });

    let calcTotalPages = onTotalPages(hits.length);
    // console.log('calcTotalPages', calcTotalPages);
    if (calcTotalPages >= totalHits) {
      loadMoreBtn.classList.add('is-hidden');
      Notify.info(
        "We're sorry, but you've reached the end of search results.",
        {
          position: 'center-bottom',
        }
      );
    }
  } catch (error) {
    console.log(error);
    gallery.innerHTML = '';
  }
}

// слушаем кнопку load More
loadMoreBtn.addEventListener('click', handleMoreClick);

async function handleMoreClick(evt) {
  const {
    data: { hits, totalHits },
  } = await forFetchPixabay(searchQuery);

  try {
    gallery.insertAdjacentHTML('beforeend', createGalleryCards(hits));
    lightbox.refresh();

    // прокрутка галереи на те картинки, которые загрузились после "load more"
    const { height: cardHeight } = document
      .querySelector('.gallery')
      .firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    let calcTotalPages = onTotalPages(hits.length);
    // console.log('calcTotalPages', calcTotalPages);

    if (calcTotalPages >= totalHits) {
      loadMoreBtn.classList.add('is-hidden');
      Notify.info(
        "We're sorry, but you've reached the end of search results.",
        {
          position: 'center-bottom',
        }
      );
    }
  } catch (error) {
    console.log(error);
    gallery.innerHTML = '';
    loadMoreBtn.classList.add('is-hidden');
  }
}
