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
 const seatCount = document.querySelector("#seat-count");
const selectedMovie = document.querySelector("#selected-movie");
 const selectedDate = document.querySelector("#selected-date");
const selectedSeats = document.querySelector("#selected-seats"); 
 const totalPrice = document.querySelector("#total-price");
const paymentButton = document.querySelector("#payment-btn");
 const paymentModal = document.querySelector("#payment-modal");
const paymentClose = document.querySelector("#payment-close");
 const paymentForm = document.querySelector("#payment-form");
const paymentSuccess = document.querySelector("#payment-success");
 const paymentMovie = document.querySelector("#payment-movie");
const paymentSeats = document.querySelector("#payment-seats");
 const paymentTotal = document.querySelector("#payment-total");
const paymentButtonPrice = document.querySelector("#payment-button-price");
 const bookingConfirmation = document.querySelector("#booking-confirmation");

 const ticketPrice = 12;
let selectedDateValue = "May 12";
 let selectedTime = "13:30";
 let selectedSeatNumbers = [];
let currentMovie = null;

async function loadBookingMovie() {
    try {
         const params = new URLSearchParams(window.location.search);
        const movieId = Number(params.get("id")) || 7;
         const response = await fetch("data/all-movies.json");

        if (!response.ok) {
            throw new Error("Failed to load movies");
        }

        const movies = await response.json();
        currentMovie = movies.find(movie => movie.id === movieId);

        if (!currentMovie) {
            throw new Error("Movie not found");
        }

         movieImage.src = currentMovie.image;
        movieImage.alt = currentMovie.title;
         movieTitle.textContent = currentMovie.title;
        movieGenre.textContent = currentMovie.genre;
         movieRating.textContent = currentMovie.rating;
        movieDuration.textContent = `${currentMovie.duration || 169} min`;
         movieAge.textContent = currentMovie.age || "12+";
        movieDescription.textContent = currentMovie.description || "Enjoy an unforgettable cinema experience with the latest movies.";
         selectedMovie.textContent = currentMovie.title;

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
            dateList.querySelectorAll(".date-btn").forEach(item => item.classList.remove("active"));
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
             timeList.querySelectorAll(".time-btn").forEach(item => item.classList.remove("active"));
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
        const seatId = `${row}${index + 1}`;
         const isBooked = bookedSeats.includes(seatId);

        return `
                        <button class="seat ${isBooked ? "booked" : ""}" type="button" data-seat="${seatId}" ${isBooked ? "disabled" : ""}></button>
                    `;
    }).join("")}
            </div>
        </div>
    `).join("");

    seatsContainer.querySelectorAll(".seat:not(.booked)").forEach(seat => {
        seat.addEventListener("click", () => {
            const seatId = seat.dataset.seat;

            if (selectedSeatNumbers.includes(seatId)) {
                selectedSeatNumbers = selectedSeatNumbers.filter(id => id !== seatId);
                seat.classList.remove("selected");
            } else {
                selectedSeatNumbers.push(seatId);
                seat.classList.add("selected");
            }

            updateSelection();
        });
    });
}

function updateSelection() {
    const sortedSeats = [...selectedSeatNumbers].sort();

    seatCount.textContent = `${sortedSeats.length} selected`;
     selectedDate.textContent = `${selectedDateValue}, ${selectedTime}`;
    selectedSeats.textContent = sortedSeats.length ? `${sortedSeats.length} seats (${sortedSeats.join(", ")})` : "0 seats";

     const total = selectedSeatNumbers.length * ticketPrice;
    totalPrice.textContent = `$${total.toFixed(2)}`;
     paymentButton.disabled = selectedSeatNumbers.length === 0;

    updateBookingStep();
}

function updateBookingStep() {
    const steps = document.querySelectorAll(".booking-step");

    steps.forEach(step => step.classList.remove("active", "completed"));

    steps[0].classList.add("completed");

    if (selectedSeatNumbers.length > 0) {
        steps[1].classList.add("active");
    } else {
        steps[0].classList.add("active");
    }
}

function openPayment() {
    if (!selectedSeatNumbers.length) {
        return;
    }

     const sortedSeats = [...selectedSeatNumbers].sort();
    const total = selectedSeatNumbers.length * ticketPrice;

     paymentMovie.textContent = currentMovie.title;
    paymentSeats.textContent = sortedSeats.join(", ");
     paymentTotal.textContent = `$${total.toFixed(2)}`;
    paymentButtonPrice.textContent = `$${total.toFixed(2)}`;

     paymentModal.classList.add("show");
    paymentSuccess.classList.remove("show");
     paymentForm.classList.remove("hidden");

    document.querySelectorAll(".booking-step").forEach(step => step.classList.remove("active"));
     document.querySelector('[data-step="3"]').classList.add("active");
}

function closePayment() {
    paymentModal.classList.remove("show");
}

paymentButton.addEventListener("click", openPayment);

paymentClose.addEventListener("click", closePayment);

document.querySelector(".payment-overlay").addEventListener("click", closePayment);

const cardNameInput = document.querySelector("#card-name");
 const cardNumberInput = document.querySelector("#card-number");
const cardExpiryInput = document.querySelector("#card-expiry");
 const cardCvvInput = document.querySelector("#card-cvv");

const cardNameError = document.querySelector("#card-name-error");
 const cardNumberError = document.querySelector("#card-number-error");
const cardExpiryError = document.querySelector("#card-expiry-error");
 const cardCvvError = document.querySelector("#card-cvv-error");

cardNumberInput.addEventListener("input", () => {
    cardNumberInput.value = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
     cardNumberError.textContent = "";
    cardNumberInput.classList.remove("error");
});

cardCvvInput.addEventListener("input", () => {
    cardCvvInput.value = cardCvvInput.value.replace(/\D/g, "").slice(0, 3);
     cardCvvError.textContent = "";
    cardCvvInput.classList.remove("error");
});

cardExpiryInput.addEventListener("input", () => {
    let value = cardExpiryInput.value.replace(/\D/g, "").slice(0, 4);

    if (value.length > 2) {
        value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    cardExpiryInput.value = value;
     cardExpiryError.textContent = "";
    cardExpiryInput.classList.remove("error");
});

cardNameInput.addEventListener("input", () => {
    cardNameError.textContent = "";
     cardNameInput.classList.remove("error");
});

paymentForm.addEventListener("submit", event => {
    event.preventDefault();

    let isValid = true;

    const name = cardNameInput.value.trim();
     const cardNumber = cardNumberInput.value.trim();
    const expiry = cardExpiryInput.value.trim();
     const cvv = cardCvvInput.value.trim();

    cardNameError.textContent = "";
     cardNumberError.textContent = "";
    cardExpiryError.textContent = "";
     cardCvvError.textContent = "";

    cardNameInput.classList.remove("error");
     cardNumberInput.classList.remove("error");
    cardExpiryInput.classList.remove("error");
     cardCvvInput.classList.remove("error");

    if (!name) {
        cardNameError.textContent = "Please enter your name";
        cardNameInput.classList.add("error");
        isValid = false;
    }

    if (!cardNumber) {
        cardNumberError.textContent = "Please enter your card number";
        cardNumberInput.classList.add("error");
        isValid = false;
    } else if (cardNumber.length !== 16) {
        cardNumberError.textContent = "Card number must contain 16 digits";
        cardNumberInput.classList.add("error");
        isValid = false;
    }

    if (!expiry) {
        cardExpiryError.textContent = "Please enter expiry date";
        cardExpiryInput.classList.add("error");
        isValid = false;
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
        cardExpiryError.textContent = "Use MM/YY format";
        cardExpiryInput.classList.add("error");
        isValid = false;
    }

    if (!cvv) {
        cardCvvError.textContent = "Please enter CVV";
        cardCvvInput.classList.add("error");
        isValid = false;
    } else if (cvv.length !== 3) {
        cardCvvError.textContent = "CVV must contain 3 digits";
        cardCvvInput.classList.add("error");
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    paymentForm.classList.add("hidden");
    paymentSuccess.classList.add("show");

    bookingConfirmation.textContent =
        `${currentMovie.title} · ${selectedDateValue} · ${selectedTime} · ${selectedSeatNumbers.join(", ")}`;
});

loadBookingMovie();