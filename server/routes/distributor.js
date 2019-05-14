const express = require('express');
const passport = require('passport')
const controller = require('../controllers/distributor');

const routes = express.Router();

//http: //localhost:8080/api/distributor
routes.post('/',  passport.authenticate('jwt', { session: false }), controller.createDistributor)

routes.get('/', passport.authenticate('jwt', { session: false }), controller.getAllDistributor)

routes.get('/:id', passport.authenticate('jwt', { session: false }), controller.getDistributorById)

routes.get('/by-region/:id', passport.authenticate('jwt', { session: false }), controller.getDistsByRegionId)

routes.put('/:id', passport.authenticate('jwt', { session: false }), controller.updateDistributorById)

routes.post('/delete', passport.authenticate('jwt', { session: false }), controller.removeDistributorById)

module.exports = routes