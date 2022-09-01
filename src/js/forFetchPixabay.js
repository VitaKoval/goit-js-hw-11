import axios from 'axios';

let page = 1;
const per_page = 4;
let totalPages = 0;

axios.defaults.baseURL = 'https://pixabay.com/api';
axios.defaults.params = {
  key: '29605366-6e90110b2388a1c27ba35efcd',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: per_page,
};

export function forFetchPixabay(searchQuery) {
  return axios.get('/', {
    params: {
      q: searchQuery,
      page: page,
}})
}

export function incrementPage() {
  page += 1;
  console.log('page', page)
}

export function onTotalPages(newTotal) {
  return totalPages += newTotal;
}


