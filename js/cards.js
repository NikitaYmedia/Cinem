const moviesGrid = document.querySelector("#movies-grid");

async function loadMovies() {
    try {
        const response = await fetch("data/movies.json");

        if (!response.ok) {
            throw new Error("Failed to load movies");
        }

        const movies = await response.json();

        renderMovies(movies.slice(0, 5));
    } catch (error) {
        console.error(error);
    }
}

function renderMovies(movies) {
    moviesGrid.innerHTML = movies.map(movie => `
        <article class="movie-card">
            <img class="movie-card-image" src="${movie.image}" alt="${movie.title}">
            <h3 class="movie-card-title">${movie.title}</h3>
            <p class="movie-card-genre">${movie.genre}</p>
            <div class="movie-card-rating">
                <span class="star">★</span>
                <span>${movie.rating}</span>
            </div>
            <a href="booking.html?id=${movie.id}" class="movie-card-button">Book Now</a>
        </article>
    `).join("");
}

loadMovies();