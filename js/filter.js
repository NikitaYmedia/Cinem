const genreFilter = document.querySelector("#genre-filter");
const yearFilter = document.querySelector("#year-filter");
const sortFilter = document.querySelector("#sort-filter");

function applyFilters() {
    const searchValue = movieSearch.value.trim().toLowerCase();
    const genreValue = genreFilter.value;
    const yearValue = yearFilter.value;
    const sortValue = sortFilter.value;

    let result = getMovies().filter(movie => {
        const title = movie.title.toLowerCase();
        const genre = movie.genre.toLowerCase();

        const matchesSearch = title.includes(searchValue);
        const matchesGenre = genreValue === "all" || genre.includes(genreValue.toLowerCase());
        const matchesYear = yearValue === "all" || movie.year === Number(yearValue);

        return matchesSearch && matchesGenre && matchesYear;
    });

    result = sortMovies(result, sortValue);
    updateMovies(result);
}

function sortMovies(movies, sortValue) {
    const result = [...movies];

    if (sortValue === "rating-desc") {
        result.sort((a, b) => b.rating - a.rating);
    }

    if (sortValue === "rating-asc") {
        result.sort((a, b) => a.rating - b.rating);
    }

    if (sortValue === "title-asc") {
        result.sort((a, b) => a.title.localeCompare(b.title));
    }

    if (sortValue === "title-desc") {
        result.sort((a, b) => b.title.localeCompare(a.title));
    }

    return result;
}

genreFilter.addEventListener("change", applyFilters);
yearFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);