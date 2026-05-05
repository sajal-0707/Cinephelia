require('dotenv').config({ path: require('path').resolve(__dirname, './.env') });
const mongoose = require('mongoose');
const Movie    = require('./models/movie.model');
const connectDB = require('./config/db');

const tomorrow = (offsetDays = 1, time = '18:30') => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(0, 0, 0, 0);
  return { date: d, time };
};

const movies = [
  {
    "title": "Dune: Part Two",
    "description": "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.",
    "genre": ["Sci-Fi", "Adventure"],
    "rating": 8.8,
    "duration": 166,
    "language": "English",
    "posterUrl": "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2JGjjc91p.jpg",
    "releaseDate": new Date("2024-02-27"),
    "director": "Denis Villeneuve",
    "cast": ["Timothée Chalamet", "Zendaya", "Rebecca Ferguson"],
    "showtimes": [
      { ...tomorrow(1, '14:00'), hall: 'IMAX', totalSeats: 150, ticketPrice: 400, bookedSeats: ['A1', 'A2', 'B3'] },
      { ...tomorrow(1, '18:30'), hall: 'Hall A', totalSeats: 100, ticketPrice: 300, bookedSeats: [] },
      { ...tomorrow(2, '21:00'), hall: 'IMAX', totalSeats: 150, ticketPrice: 400, bookedSeats: ['C5', 'C6'] },
    ]
  },
  {
    "title": "Kung Fu Panda 4",
    "description": "Po is gearing up to become the spiritual leader of his Valley of Peace, but also needs someone to take his place as Dragon Warrior.",
    "genre": ["Animation", "Action", "Comedy"],
    "rating": 7.1,
    "duration": 94,
    "language": "English",
    "posterUrl": "https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg",
    "releaseDate": new Date("2024-03-02"),
    "director": "Mike Mitchell",
    "cast": ["Jack Black", "Awkwafina", "Viola Davis"],
    "showtimes": [
      { ...tomorrow(1, '10:00'), hall: 'Hall B', totalSeats: 80, ticketPrice: 200, bookedSeats: [] },
      { ...tomorrow(1, '13:30'), hall: 'Hall B', totalSeats: 80, ticketPrice: 200, bookedSeats: ['A1'] },
      { ...tomorrow(2, '16:00'), hall: 'Hall A', totalSeats: 100, ticketPrice: 250, bookedSeats: [] }
    ]
  },
  {
    "title": "Godzilla x Kong: The New Empire",
    "description": "Following their explosive showdown, Godzilla and Kong must reunite against a colossal undiscovered threat hidden within our world.",
    "genre": ["Action", "Sci-Fi"],
    "rating": 7.2,
    "duration": 115,
    "language": "English",
    "posterUrl": "https://image.tmdb.org/t/p/w500/bQ2ywkchIiaKLSEaMrcT6e28f91.jpg",
    "releaseDate": new Date("2024-03-27"),
    "director": "Adam Wingard",
    "cast": ["Rebecca Hall", "Brian Tyree Henry", "Dan Stevens"],
    "showtimes": [
      { ...tomorrow(1, '16:00'), hall: 'IMAX', totalSeats: 150, ticketPrice: 400, bookedSeats: [] },
      { ...tomorrow(2, '19:30'), hall: 'IMAX', totalSeats: 150, ticketPrice: 400, bookedSeats: [] }
    ]
  },
  {
    "title": "Civil War",
    "description": "In the near future, a team of journalists travel across the United States during a rapidly escalating civil war.",
    "genre": ["Action", "Thriller"],
    "rating": 7.4,
    "duration": 109,
    "language": "English",
    "posterUrl": "https://image.tmdb.org/t/p/w500/sh7Rg8Er3tFcN9BpKIPOMvALgZd.jpg",
    "releaseDate": new Date("2024-04-10"),
    "director": "Alex Garland",
    "cast": ["Kirsten Dunst", "Wagner Moura", "Cailee Spaeny"],
    "showtimes": [
      { ...tomorrow(1, '20:00'), hall: 'Hall C', totalSeats: 90, ticketPrice: 220, bookedSeats: [] }
    ]
  },
  {
    "title": "Ghostbusters: Frozen Empire",
    "description": "When the discovery of an ancient artifact unleashes an evil force, Ghostbusters new and old must join forces.",
    "genre": ["Comedy", "Sci-Fi", "Fantasy"],
    "rating": 6.8,
    "duration": 115,
    "language": "English",
    "posterUrl": "https://image.tmdb.org/t/p/w500/stmYfCUGd8Iy6ISFAq20mB1123t.jpg",
    "releaseDate": new Date("2024-03-20"),
    "director": "Gil Kenan",
    "cast": ["Paul Rudd", "Carrie Coon", "Finn Wolfhard"],
    "showtimes": [
      { ...tomorrow(1, '14:30'), hall: 'Hall A', totalSeats: 100, ticketPrice: 250, bookedSeats: [] }
    ]
  },
  {
    "title": "Furiosa: A Mad Max Saga",
    "description": "As the world falls, young Furiosa is snatched from the Green Place of Many Mothers into the hands of a great Biker Horde.",
    "genre": ["Action", "Adventure"],
    "rating": 7.7,
    "duration": 148,
    "language": "English",
    "posterUrl": "https://image.tmdb.org/t/p/w500/iADOJ8Zymht2JPMoy3R7xceZprc.jpg",
    "releaseDate": new Date("2024-05-22"),
    "director": "George Miller",
    "cast": ["Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke"],
    "showtimes": [
      { ...tomorrow(1, '21:30'), hall: 'IMAX', totalSeats: 150, ticketPrice: 400, bookedSeats: [] }
    ]
  },
  {
    "title": "The Fall Guy",
    "description": "A stuntman, fresh off an almost career-ending accident, has to track down a missing movie star.",
    "genre": ["Action", "Comedy"],
    "rating": 7.3,
    "duration": 126,
    "language": "English",
    "posterUrl": "https://image.tmdb.org/t/p/w500/tSz1qsmSJon0rqjHBxXZmrotuse.jpg",
    "releaseDate": new Date("2024-04-24"),
    "director": "David Leitch",
    "cast": ["Ryan Gosling", "Emily Blunt", "Aaron Taylor-Johnson"],
    "showtimes": [
      { ...tomorrow(1, '18:00'), hall: 'Hall B', totalSeats: 80, ticketPrice: 200, bookedSeats: [] }
    ]
  },
  {
    "title": "Inside Out 2",
    "description": "Teenager Riley's mind headquarters is undergoing a sudden demolition to make room for something entirely unexpected: new Emotions!",
    "genre": ["Animation", "Family"],
    "rating": 8.0,
    "duration": 96,
    "language": "English",
    "posterUrl": "https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg",
    "releaseDate": new Date("2024-06-11"),
    "director": "Kelsey Mann",
    "cast": ["Amy Poehler", "Maya Hawke", "Kensington Tallman"],
    "showtimes": [
      { ...tomorrow(1, '11:00'), hall: 'Hall A', totalSeats: 100, ticketPrice: 200, bookedSeats: [] }
    ]
  },
  {
    "title": "Kingdom of the Planet of the Apes",
    "description": "Many years after the reign of Caesar, a young ape goes on a journey that will lead him to question everything he's been taught.",
    "genre": ["Sci-Fi", "Action"],
    "rating": 7.2,
    "duration": 145,
    "language": "English",
    "posterUrl": "https://image.tmdb.org/t/p/w500/gKkl37BQuKTanygYQG1pyYgLVgf.jpg",
    "releaseDate": new Date("2024-05-08"),
    "director": "Wes Ball",
    "cast": ["Owen Teague", "Freya Allan", "Kevin Durand"],
    "showtimes": [
      { ...tomorrow(2, '14:00'), hall: 'Hall B', totalSeats: 80, ticketPrice: 220, bookedSeats: [] }
    ]
  },
  {
    "title": "Deadpool & Wolverine",
    "description": "A listless Wade Wilson toils away in civilian life with his days as the morally flexible mercenary, Deadpool, behind him.",
    "genre": ["Action", "Comedy", "Superhero"],
    "rating": 8.2,
    "duration": 127,
    "language": "English",
    "posterUrl": "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
    "releaseDate": new Date("2024-07-24"),
    "director": "Shawn Levy",
    "cast": ["Ryan Reynolds", "Hugh Jackman", "Emma Corrin"],
    "showtimes": [
      { ...tomorrow(1, '19:00'), hall: 'IMAX', totalSeats: 150, ticketPrice: 400, bookedSeats: [] },
      { ...tomorrow(2, '22:00'), hall: 'IMAX', totalSeats: 150, ticketPrice: 400, bookedSeats: [] }
    ]
  }
];

(async () => {
  try {
    await connectDB();
    await Movie.deleteMany({});
    const inserted = await Movie.insertMany(movies);
    console.log(`\n🌱 Seeded ${inserted.length} movies successfully!\n`);
    inserted.forEach((m) => console.log(`   • ${m.title}  (${m.showtimes.length} showtimes)`));
    console.log();
  } catch (err) {
    console.error('Seeder error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
})();
