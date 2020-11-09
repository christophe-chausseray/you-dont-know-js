// global scope (Red): 1
var movies = [
    { id: 1, title: 'Adu', genres: ['Drama', 'Social Issue Drame'], public: true},
    { id: 2, title: 'The Down Wall', genres: ['Documentary', 'Sports', 'Biographical'], public: true},
    { id: 3, title: 'Secrets of Saqqara Tomb', genres: ['Documentary', 'Social & culture'], public: true},
    { id: 4, title: 'Instant family', genres: ['Comedie'], public: true},
    { id: 5, title: 'Just mercy', genres: ['Drama', 'Real life'], public: false}
]

function getPublicMoviesTitleByGenre(/*implie scope (White): 2*/genre = 'comedie') {
    // function scope (Blue): 3
    let moviesByGenre = [];
    genre = genre[0].toUpperCase() + genre.substring(1);

    for (let movie of movies) {
        // block scope for (Green): 4
        if (movie.genres.includes(genre)) {
            // block scope if (Purple): 5
            moviesByGenre.push(movie);
        }
    }

    return moviesByGenre
    .filter(function isPublic(movie) {
        // function scope (Pink): 6
        return true === movie.public;
    })
    .map(function getTitle(movie) {
        // function scope (Yellow): 7
        return movie.title
    });
}

console.log(getPublicMoviesTitleByGenre('drama'));
