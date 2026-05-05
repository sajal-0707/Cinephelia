require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Movie    = require('../models/movie.model');
const connectDB = require('../config/db');

const tomorrow = (offsetDays = 1, time = '18:30') => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(0, 0, 0, 0);
  return { date: d, time };
};

const movies = [
  {
    title: 'Galactic Odyssey',
    description: 'A crew of astronauts ventures beyond the known galaxy to find a new home for humanity.',
    genre: ['Sci-Fi', 'Adventure'],
    language: 'English',
    duration: 148,
    releaseDate: new Date('2025-03-15'),
    rating: 8.4,
    posterUrl: 'https://picsum.photos/seed/galactic/300/450',
    director: 'Sofia Reyes',
    cast: ['James Holden', 'Naomi Nagata', 'Alex Kamal'],
    showtimes: [
      { ...tomorrow(1, '14:00'), hall: 'Hall A', totalSeats: 100, ticketPrice: 250, bookedSeats: ['A1', 'A2', 'B3'] },
      { ...tomorrow(1, '18:30'), hall: 'Hall B', totalSeats: 100, ticketPrice: 300, bookedSeats: [] },
      { ...tomorrow(2, '21:00'), hall: 'Hall A', totalSeats: 100, ticketPrice: 300, bookedSeats: ['C5', 'C6'] },
    ],
  },
  {
    title: 'The Last Detective',
    description: 'A retired detective gets drawn back into action when a series of baffling crimes shake his quiet town.',
    genre: ['Thriller', 'Mystery'],
    language: 'English',
    duration: 112,
    releaseDate: new Date('2025-01-22'),
    rating: 7.9,
    posterUrl: 'https://picsum.photos/seed/detective/300/450',
    director: 'Marcus Webb',
    cast: ['Ellen Marsh', 'Tom Vance'],
    showtimes: [
      { ...tomorrow(1, '11:00'), hall: 'Hall C', totalSeats: 80, ticketPrice: 200, bookedSeats: [] },
      { ...tomorrow(1, '16:00'), hall: 'Hall C', totalSeats: 80, ticketPrice: 220, bookedSeats: ['D1','D2','E3'] },
      { ...tomorrow(3, '20:00'), hall: 'Hall D', totalSeats: 80, ticketPrice: 220, bookedSeats: [] },
    ],
  },
  {
    title: 'Monsoon Wedding 2',
    description: 'A multi-generational family reunion becomes chaotic when long-kept secrets surface over a weekend wedding.',
    genre: ['Drama', 'Comedy'],
    language: 'Hindi',
    duration: 130,
    releaseDate: new Date('2025-05-01'),
    rating: 8.1,
    posterUrl: 'https://picsum.photos/seed/wedding/300/450',
    director: 'Priya Kapoor',
    cast: ['Aisha Khan', 'Ravi Sharma', 'Sunita Mehta'],
    showtimes: [
      { ...tomorrow(1, '13:00'), hall: 'Hall B', totalSeats: 120, ticketPrice: 180, bookedSeats: [] },
      { ...tomorrow(2, '17:30'), hall: 'Hall A', totalSeats: 120, ticketPrice: 200, bookedSeats: ['F1','F2'] },
    ],
  },
  {
    title: 'Iron Phantom',
    description: 'A vigilante with a mysterious past must stop a technological conspiracy threatening world governments.',
    genre: ['Action', 'Superhero'],
    language: 'English',
    duration: 155,
    releaseDate: new Date('2025-06-10'),
    rating: 7.6,
    posterUrl: 'https://picsum.photos/seed/phantom/300/450',
    director: 'Derek Storm',
    cast: ['Chris Vale', 'Jessica Moon', 'Lee Park'],
    showtimes: [
      { ...tomorrow(1, '12:00'), hall: 'IMAX',   totalSeats: 150, ticketPrice: 450, bookedSeats: ['A1','A2','A3'] },
      { ...tomorrow(1, '16:00'), hall: 'Hall A',  totalSeats: 100, ticketPrice: 300, bookedSeats: [] },
      { ...tomorrow(1, '20:00'), hall: 'IMAX',    totalSeats: 150, ticketPrice: 450, bookedSeats: [] },
      { ...tomorrow(2, '19:00'), hall: 'Hall B',  totalSeats: 100, ticketPrice: 300, bookedSeats: [] },
    ],
  },
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
