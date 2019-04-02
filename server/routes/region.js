const express = require('express');
const passport = require('passport')
const controller = require('../controllers/region');

const routes = express.Router();

//http: //localhost:8080/api/Region
routes.post('/', passport.authenticate('jwt', { session: false }), controller.createRegion)

routes.get('/',  passport.authenticate('jwt', { session: false }), controller.getAllRegion)

routes.get('/:id', passport.authenticate('jwt', { session: false }), controller.getRegionById)

routes.put('/:id', passport.authenticate('jwt', { session: false }), controller.updateRegionById)

routes.delete('/:id', passport.authenticate('jwt', { session: false }), controller.removeRegionById)

module.exports = routes