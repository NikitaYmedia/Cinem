const movieSearch = document.querySelector("#movie-search");
const searchButton = document.querySelector(".filter-search-btn");

if (movieSearch) {
    movieSearch.addEventListener("input", applyFilters);
}

if (searchButton) {
    searchButton.addEventListener("click", applyFilters);
}