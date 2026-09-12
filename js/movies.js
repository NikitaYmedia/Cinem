let movies = [];
let filteredMovies = [];
let currentPage = 1;
const moviesPerPage = 10;

async function loadMovies() {
    try {
        const response = await fetch("data/all-movies.json");

        if (!response.ok) {
            throw new Error("Failed to load movies");
        }

        movies = await response.json();
        filteredMovies = [...movies];

        createGenreOptions();
        createYearOptions();
        renderMoviesPage();
    } catch (error) {
        console.error("Movies loading error:", error);
    }
}

function renderMoviesPage() {
    const start = (currentPage - 1) * moviesPerPage;
    const end = start + moviesPerPage;

    renderMovies(filteredMovies.slice(start, end));
    renderPagination();
}

function renderPagination() {
    const pagination = document.querySelector("#pagination");

    if (!pagination) return;

    const totalPages = Math.ceil(filteredMovies.length / moviesPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = "";
        return;
    }

    pagination.innerHTML = `
        <button type="button" data-page="prev">←</button>
        ${Array.from({ length: totalPages }, (_, index) => `
            <button type="button" data-page="${index + 1}" class="${currentPage === index + 1 ? "active" : ""}">
                ${index + 1}
            </button>
        `).join("")}
        <button type="button" data-page="next">→</button>
    `;

    pagination.querySelectorAll("button").forEach(button => {
        button.addEventListener("click", () => {
            const page = button.dataset.page;

            if (page === "prev" && currentPage > 1) {
                currentPage--;
            } else if (page === "next" && currentPage < totalPages) {
                currentPage++;
            } else if (!isNaN(page)) {
                currentPage = Number(page);
            }

            renderMoviesPage();
        });
    });
}

function createGenreOptions() {
    const genreFilter = document.querySelector("#genre-filter");
    const genres = new Set();

    movies.forEach(movie => {
        movie.genre.split(", ").forEach(genre => genres.add(genre));
    });

    [...genres].sort().forEach(genre => {
        genreFilter.insertAdjacentHTML(
            "beforeend",
            `<option value="${genre}">${genre}</option>`
        );
    });
}

function createYearOptions() {
    const yearFilter = document.querySelector("#year-filter");
    const years = [...new Set(movies.map(movie => movie.year))]
        .sort((a, b) => b - a);

    years.forEach(year => {
        yearFilter.insertAdjacentHTML(
            "beforeend",
            `<option value="${year}">${year}</option>`
        );
    });
}

function updateMovies(newMovies) {
    filteredMovies = [...newMovies];
    currentPage = 1;
    renderMoviesPage();
}

function getMovies() {
    return movies;
}

loadMovies();