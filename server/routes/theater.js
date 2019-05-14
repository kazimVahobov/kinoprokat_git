const express = require('express');
const passport = require('passport')
const controller = require('../controllers/theater');

const routes = express.Router();

//http: //localhost:8080/api/theater
routes.post('/', passport.authenticate('jwt', { session: false }), controller.createTheater)

routes.get('/', passport.authenticate('jwt', { session: false }), controller.getAllTheater)

routes.get('/:id', passport.authenticate('jwt', { session: false }), controller.getTheaterById)

routes.get('/by-region/:id', passport.authenticate('jwt', { session: false }), controller.getTheatersByRegionId)

routes.put('/:id', passport.authenticate('jwt', { session: false }), controller.updateTheaterById)

routes.post('/delete', passport.authenticate('jwt', { session: false }), controller.removeTheaterById)

module.exports = routes