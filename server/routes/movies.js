const express = require('express');
const passport = require('passport')
const controller = require('../controllers/movies');
const upload = require('../middleware/uploadMovieLic')

const routes = express.Router();

//http: //localhost:8080/api/movie
routes.post('/', passport.authenticate('jwt', { session: false }), upload.single('file'),  controller.createMovie)

routes.get('/', passport.authenticate('jwt', { session: false }), controller.getAllMovie)

routes.get('/:id', passport.authenticate('jwt', { session: false }), controller.getMovieById)

routes.put('/:id', passport.authenticate('jwt', { session: false }), upload.single('file'),  controller.updateMovieById)

routes.post('/delete', passport.authenticate('jwt', { session: false }), controller.removeMovieById)

module.exports = routes