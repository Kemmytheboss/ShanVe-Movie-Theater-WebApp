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

// updating the list item after ticket purchase

function updatedFilmItems(film) {
    const items = document.querySelectorAll('#films li')
    items.forEach(item => {
        if(item.dataset.id === film.id) {
            const available = film.capacity - film.tickets_sold;
            if (available <= 0){
                item.classList.add('sold-out');
                item.textContent = `${film.title} ('Sold Out)`;
            }
            else {
                item.classList.remove('sold-out');
                item.textContent = film.title;
            }
        }
    });
}

// deleteing movie from the list and server 
films.forEach(film => {
  const li = document.createElement('li');
  li.textContent = film.title;
  li.classList.add('film-item');
  li.dataset.id = film.id;

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');
  li.appendChild(deleteBtn);

  filmList.appendChild(li);
});

// handle delete click
filmsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('delete-btn')) {
    const filmId = e.target.parentElement.dataset.id;
    fetch(`http://localhost:3000/films/${filmId}`, {
      method: 'DELETE'
    })
    .then(() => {
      e.target.parentElement.remove();

      // Optionally, clear details if deleted movie is showing
      if(currentFilm && currentFilm.id === filmId) {
        poster.src = '';
        title.textContent = '';
        runtime.textContent = '';
        showtime.textContent = '';
        availableTickets.textContent = '';
        description.textContent = '';
        buyTicketBtn.disabled = true;
      }
    });
  }
});

fetch('http://localhost:3000/tickets', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    film_id: currentFilm.id,
    number_of_tickets: 1
  })
});
