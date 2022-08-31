import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api';
axios.defaults.params = {
  key: '29605366-6e90110b2388a1c27ba35efcd',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
};

export function forFetchPixabay(searchQuery) {
  return axios.get('/', {
    params: {
  q: searchQuery,
}})
}
