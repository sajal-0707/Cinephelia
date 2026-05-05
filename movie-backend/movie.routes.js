const express = require('express');
const router  = express.Router();
const movieController = require('../controllers/movie.controller');

// Public routes
router.get('/',                     movieController.listMovies);
router.get('/:id',                  movieController.getMovie);
router.get('/:id/showtimes',        movieController.getShowtimes);
router.get('/:id/showtimes/:stId/seats', movieController.getSeatMap);
router.post('/', movieController.createMovie);
router.delete('/:id', movieController.deleteMovie);
router.post('/sync', movieController.syncMovies);
module.exports = router;
