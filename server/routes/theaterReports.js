const express = require('express');
const passport = require('passport')
const controller = require('../controllers/theaterReports');

const routes = express.Router();

//http: //localhost:8080/api/theater-report
routes.post('/', passport.authenticate('jwt', { session: false }), controller.createTheaterReports)

routes.get('/', passport.authenticate('jwt', { session: false }), controller.getAllTheaterReports)

routes.get('/:id', passport.authenticate('jwt', { session: false }), controller.getTheaterReportsById)

routes.get('/by-theater/:id', passport.authenticate('jwt', { session: false }), controller.getTheaterReportsByTheaterId)

routes.put('/:id', passport.authenticate('jwt', { session: false }), controller.updateTheaterReportsById)

routes.delete('/:id', passport.authenticate('jwt', { session: false }), controller.removeTheaterReportsById)

module.exports = routes