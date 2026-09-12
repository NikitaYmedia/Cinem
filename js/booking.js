const movieImage = document.querySelector("#booking-movie-image");
const movieTitle = document.querySelector("#booking-movie-title");
const movieGenre = document.querySelector("#booking-movie-genre");
const movieRating = document.querySelector("#booking-movie-rating");
const movieDuration = document.querySelector("#booking-movie-duration");
const movieAge = document.querySelector("#booking-movie-age");
const movieDescription = document.querySelector("#booking-movie-description");

const dateList = document.querySelector("#date-list");
const timeList = document.querySelector("#time-list");
const seatsContainer = document.querySelector("#seats");

const selectedMovie = document.querySelector("#selected-movie");
const selectedDate = document.querySelector("#selected-date");
const selectedSeats = document.querySelector("#selected-seats");
const totalPrice = document.querySelector("#total-price");
const paymentButton = document.querySelector("#payment-btn");

const ticketPrice = 12;
let selectedDateValue = "May 12";
let selectedTime = "13:30";
let selectedSeatNumbers = [];

async function loadBookingMovie() {
    try {
        const params = new URLSearchParams(window.location.search);
        const movieId = Number(params.get("id")) || 7;

        const response = await fetch("data/all-movies.json");

        if (!response.ok) {
            throw new Error("Failed to load movies");
        }

        const movies = await response.json();
        const movie = movies.find(item => item.id === movieId);

        if (!movie) {
            throw new Error("Movie not found");
        }

        movieImage.src = movie.image;
        movieImage.alt = movie.title;
        movieTitle.textContent = movie.title;
        movieGenre.textContent = movie.genre;
        movieRating.textContent = movie.rating;
        movieDuration.textContent = `${movie.duration || 169} min`;
        movieAge.textContent = movie.age || "12+";
        movieDescription.textContent = movie.description || "Enjoy an unforgettable cinema experience with the latest movies.";

        selectedMovie.textContent = movie.title;

        renderDates();
        renderTimes();
        renderSeats();
        updateSelection();
    } catch (error) {
        console.error("Booking loading error:", error);
    }
}

function renderDates() {
    const dates = [
        { day: "Today", date: "May 12" },
        { day: "Tomorrow", date: "May 13" },
        { day: "Wed", date: "May 14" },
        { day: "Thu", date: "May 15" },
        { day: "Fri", date: "May 16" }
    ];

    dateList.innerHTML = dates.map((item, index) => `
        <button class="date-btn ${index === 0 ? "active" : ""}" type="button" data-date="${item.date}">
            <span>${item.day}</span>
            <strong>${item.date}</strong>
        </button>
    `).join("");

    dateList.querySelectorAll(".date-btn").forEach(button => {
        button.addEventListener("click", () => {
            dateList.querySelectorAll(".date-btn").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            selectedDateValue = button.dataset.date;
            updateSelection();
        });
    });
}

function renderTimes() {
    const times = ["10:00", "13:30", "17:00", "20:30"];

    timeList.innerHTML = times.map((time, index) => `
        <button class="time-btn ${index === 1 ? "active" : ""}" type="button" data-time="${time}">
            ${time}
        </button>
    `).join("");

    timeList.querySelectorAll(".time-btn").forEach(button => {
        button.addEventListener("click", () => {
            timeList.querySelectorAll(".time-btn").forEach(item => {
                item.classList.remove("active");
            });

            button.classList.add("active");
            selectedTime = button.dataset.time;
            updateSelection();
        });
    });
}

function renderSeats() {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
    const bookedSeats = ["A4", "A5", "B6", "C8", "D3", "E5", "F7", "G4", "H9"];

    seatsContainer.innerHTML = rows.map(row => `
        <div class="seat-row">
            <span class="row-label">${row}</span>
            <div class="row-seats">
                ${Array.from({ length: 10 }, (_, index) => {
                    const seatNumber = index + 1;
                    const seatId = `${row}${seatNumber}`;
                    const isBooked = bookedSeats.includes(seatId);

                    return `
                        <button
                            class="seat ${isBooked ? "booked" : ""}"
                            type="button"
                            data-seat="${seatId}"
                            ${isBooked ? "disabled" : ""}
                        >
                            ${seatNumber}
                        </button>
                    `;
                }).join("")}
            </div>
        </div>
    `).join("");

    seatsContainer.querySelectorAll(".seat:not(.booked)").forEach(seat => {
        seat.addEventListener("click", () => {
            const seatId = seat.dataset.seat;

            seat.classList.toggle("selected");

            if (selectedSeatNumbers.includes(seatId)) {
                selectedSeatNumbers = selectedSeatNumbers.filter(id => id !== seatId);
            } else {
                selectedSeatNumbers.push(seatId);
            }

            updateSelection();
        });
    });
}

function updateSelection() {
    selectedDate.textContent = `${selectedDateValue}, ${selectedTime}`;

    if (selectedSeatNumbers.length) {
        const sortedSeats = [...selectedSeatNumbers].sort();
        selectedSeats.textContent = `${sortedSeats.length} seats (${sortedSeats.join(", ")})`;
    } else {
        selectedSeats.textContent = "0 seats";
    }

    const total = selectedSeatNumbers.length * ticketPrice;
    totalPrice.textContent = `$${total.toFixed(2)}`;
}

paymentButton.addEventListener("click", () => {
    if (!selectedSeatNumbers.length) {
        alert("Please select at least one seat.");
        return;
    }

    alert(`Booking confirmed for ${selectedSeatNumbers.length} seat(s).`);
});

loadBookingMovie();