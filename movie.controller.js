const Movie = require('../models/movie.model');

/**
 * GET /api/movies
 * Query params: search, genre, language, page, limit
 */
exports.listMovies = async (req, res, next) => {
  try {
    const { search, genre, language, page = 1, limit = 12 } = req.query;
    const filter = { isActive: true };

    if (search) filter.$text = { $search: search };
    if (genre)  filter.genre = { $in: [genre] };
    if (language) filter.language = language;

    const skip = (Number(page) - 1) * Number(limit);

    const [movies, total] = await Promise.all([
      Movie.find(filter)
        .select('title genre language duration rating posterUrl releaseDate')
        .sort({ releaseDate: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Movie.countDocuments(filter),
    ]);

    res.json({
      success: true,
      total,
      page:  Number(page),
      pages: Math.ceil(total / Number(limit)),
      movies,
    });
  } catch (err) { next(err); }
};

/**
 * GET /api/movies/:id
 */
exports.getMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.id, isActive: true });
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });
    res.json({ success: true, movie });
  } catch (err) { next(err); }
};

/**
 * GET /api/movies/:id/showtimes
 * Returns upcoming showtimes (today onwards).
 */
exports.getShowtimes = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.id, isActive: true })
      .select('title showtimes');
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });

    const now = new Date();
    const upcoming = movie.showtimes.filter((s) => new Date(s.date) >= now);

    res.json({ success: true, movieId: movie._id, title: movie.title, showtimes: upcoming });
  } catch (err) { next(err); }
};

/**
 * GET /api/movies/:id/showtimes/:stId/seats
 * Returns the full seat map with availability status.
 */
exports.getSeatMap = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ _id: req.params.id, isActive: true });
    if (!movie) return res.status(404).json({ success: false, message: 'Movie not found' });

    const showtime = movie.showtimes.id(req.params.stId);
    if (!showtime) return res.status(404).json({ success: false, message: 'Showtime not found' });

    const rows  = 'ABCDEFGHIJ'.split('');       // 10 rows
    const cols  = Array.from({ length: 10 }, (_, i) => i + 1); // 10 cols = 100 seats
    const seats = [];

    rows.forEach((row) => {
      cols.forEach((col) => {
        const label  = `${row}${col}`;
        const booked = showtime.bookedSeats.includes(label);
        seats.push({ label, row, col, status: booked ? 'booked' : 'available' });
      });
    });

    res.json({
      success: true,
      showtime: {
        _id:         showtime._id,
        date:        showtime.date,
        time:        showtime.time,
        hall:        showtime.hall,
        ticketPrice: showtime.ticketPrice,
        totalSeats:  showtime.totalSeats,
        available:   showtime.totalSeats - showtime.bookedSeats.length,
      },
      seats,
    });
  } catch (err) { next(err); }
};
