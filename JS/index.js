const filmList = document.getElementById('films');
const poster = document.getElementById('poster');
const title  = document.getElementById('title');
const runtime = document.getElementById('runtime');
const showtime = document.getElementById('showtime');
const availableTickets = document.getElementById('available-tickets');
const description = document.getElementById('description');
const buyTicket = document.getElementById('buy-ticket');

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