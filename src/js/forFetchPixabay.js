export function forFetchPixabay(searchQuery) {
  const searchParams = new URLSearchParams({
    key: '29605366-6e90110b2388a1c27ba35efcd',
    q: searchQuery,
    // image_type: photo,
    // orientation: horizontal,
    // safesearch: true,
  });

  const URL = `https://pixabay.com/api/?${searchParams}`;
    // console.log(URL)

  return fetch(URL).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    
    return response.json();
  });
}