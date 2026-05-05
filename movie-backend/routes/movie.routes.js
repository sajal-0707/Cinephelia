const express = require('express');
const router  = express.Router();
const movieController = require('../controllers/movie.controller');

// Public routes
router.get('/',                          movieController.listMovies);
router.post('/sync',                     movieController.syncMovies);
router.post('/',                         movieController.createMovie);
router.get('/:id',                       movieController.getMovie);
router.get('/:id/showtimes',             movieController.getShowtimes);
router.get('/:id/showtimes/:stId/seats', movieController.getSeatMap);
router.delete('/:id',                    movieController.deleteMovie);

module.exports = router;