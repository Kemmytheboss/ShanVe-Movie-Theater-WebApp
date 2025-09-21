const filmList = document.getElementById('films');
const poster = document.getElementById('poster');
const title  = document.getElementById('title');
const runtime = document.getElementById('runtime');
const showtime = document.getElementById('showtime');
const availableTickets = document.getElementById('available-tickets');
const description = document.getElementById('description');
const buyTicketBtn = document.getElementById('buy-ticket');

// this function fetches the films then diplays the available film list
let currentFilm = null;

function fetchFilms(){
    fetch('http:localhoost:3000/films')
    .then(res=> res.json())
    .then(films => {
        filmList.innerHTML = '';

        films.forEach(film => {
            const li = document.createElement('li');
            li.textContent = film.title;
            li.classList.add('filt-item');
            if(film.capacity - film.tickets.sold <= 0){
                li.classList.add('sold-out');
                li.textContent += "(Sold-Out)";
            }
            li.dataset.id = film.id;
            filmList.appendChild(li);
        });
        showFilmDetails(films[0]);
    });
}

// to show film details on the right panel

function showFilmDetails(film){
    currentFilm = film;
    poster.src= film.poster;
    title.textContent = `Runtime: ${film.runtime} minutes`;
    showtime.textContent =`Showtime: ${film.showtime}`;
    const available = film.capacity - film.tickets_sold;
    availableTickets.textContent = `Available Tickets: ${available > 0 ? available : "Sold Out"}`;
    description.textContent = film.description;

    buyTicketBtn.disabled = available <= 0;
    buyTicketBtn.textContent = available <= 0 ? "Sold Out" : "Buy Ticket";

}

// adding event listener to film list for clicking movies
filmList.addEventListener('click', (e) =>{
    if(e.target.tagName === 'LI'){
        const filmId = e.target.dataset.id;
        fetch(`http://localhost:3000/films/${filmId}`)
        .then(res => res.json())
        .then(film => {
            showFilmDetails(film);
        });
    }
});

// handle buying tickets
buyTicketBtn.addEventListener('click', () =>{
    if(!currentFilm) return;
    let ticketsSold = currentFilm.tickets_sold;
    let capacity = currentFilm.capacity;


    if(ticketsSold >= capacity){
        alert('Sorry, this movie is sold out!');
        return;
    }
    ticketsSold++;

    fetch(`http://localhost:3000/films/${currentFilm.id}`, {
        method: 'PATCH',
        header: {
           ' Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify ({
            tickets_sold: ticketsSold
        })
    })
    .then(res => res.json)
    .then(updatedFilm => {
        currentFilm  = updatedFilm;
        showFilmDetails(updatedFilm);
        updatedFilmItems(updatedFilm);
    })
})

