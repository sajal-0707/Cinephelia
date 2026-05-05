const movies = [
  {
    "title": "Dune: Part Two",
    "description": "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    "rating": 8.8,
    "posterUrl": "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjc91p.jpg",
    "releaseDate": "2024-02-27",
    "isActive": true
  },
  {
    "title": "Kung Fu Panda 4",
    "description": "Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.",
    "rating": 7.1,
    "posterUrl": "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    "releaseDate": "2024-03-02",
    "isActive": true
  },
  {
    "title": "Godzilla x Kong: The New Empire",
    "description": "Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world.",
    "rating": 7.2,
    "posterUrl": "https://image.tmdb.org/t/p/w500/bQ2ywkchIiaKLSEaMrcT6e28f91.jpg",
    "releaseDate": "2024-03-27",
    "isActive": true
  },
  {
    "title": "Civil War",
    "description": "In the near future, a team of journalists travel across the United States during a rapidly escalating civil war.",
    "rating": 7.4,
    "posterUrl": "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    "releaseDate": "2024-04-10",
    "isActive": true
  },
  {
    "title": "Ghostbusters: Frozen Empire",
    "description": "When the discovery of an ancient artifact unleashes an evil force, Ghostbusters new and old must join forces.",
    "rating": 6.8,
    "posterUrl": "https://image.tmdb.org/t/p/w500/stmYfCUGd8Iy6ISFAq20mB1123t.jpg",
    "releaseDate": "2024-03-20",
    "isActive": true
  },
  {
    "title": "Furiosa: A Mad Max Saga",
    "description": "As the world falls, young Furiosa is snatched from the Green Place of Many Mothers into the hands of a great Biker Horde.",
    "rating": 7.7,
    "posterUrl": "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    "releaseDate": "2024-05-22",
    "isActive": true
  },
  {
    "title": "The Fall Guy",
    "description": "A stuntman, fresh off an almost career-ending accident, has to track down a missing movie star.",
    "rating": 7.3,
    "posterUrl": "https://image.tmdb.org/t/p/w500/tSz1qsmSJon0rqjHBxXZmrotuse.jpg",
    "releaseDate": "2024-04-24",
    "isActive": true
  },
  {
    "title": "Inside Out 2",
    "description": "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!",
    "rating": 8.0,
    "posterUrl": "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    "releaseDate": "2024-06-11",
    "isActive": true
  },
  {
    "title": "Kingdom of the Planet of the Apes",
    "description": "Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he's been taught.",
    "rating": 7.2,
    "posterUrl": "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    "releaseDate": "2024-05-08",
    "isActive": true
  },
  {
    "title": "Deadpool & Wolverine",
    "description": "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him.",
    "rating": 8.2,
    "posterUrl": "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    "releaseDate": "2024-07-24",
    "isActive": true
  }
];

async function seed() {
  for (const movie of movies) {
    try {
      const res = await fetch('http://localhost:4000/api/movies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(movie)
      });
      console.log(`Added: ${movie.title} - ${res.status}`);
    } catch (err) {
      console.error(`Failed to add ${movie.title}: ${err.message}`);
    }
  }
}

seed();
