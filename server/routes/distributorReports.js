const express = require('express');
const passport = require('passport')
const controller = require('../controllers/distributorReports');

const routes = express.Router();

//http: //localhost:8080/api/distributor-report
routes.post('/', passport.authenticate('jwt', { session: false }), controller.createDistributorReports)

routes.get('/', passport.authenticate('jwt', { session: false }), controller.getAllDistributorReports)

routes.get('/:id', passport.authenticate('jwt', { session: false }), controller.getDistributorReportsById)

routes.get('/by-dist/:id', passport.authenticate('jwt', { session: false }), controller.getDistributorReportsByDistId)

routes.put('/:id', passport.authenticate('jwt', { session: false }), controller.updateDistributorReportsById)

routes.delete('/:id', passport.authenticate('jwt', { session: false }), controller.removeDistributorReportsById)

module.exports = routes