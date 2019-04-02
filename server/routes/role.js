const express = require('express');
const passport = require('passport')
const controller = require('../controllers/role');

const routes = express.Router();

//http: //localhost:8080/api/role
routes.post('/', passport.authenticate('jwt', { session: false }), controller.createRole)

routes.get('/',  passport.authenticate('jwt', { session: false }), controller.getAllRole)

routes.get('/:id', passport.authenticate('jwt', { session: false }), controller.getRoleById)

routes.put('/:id', passport.authenticate('jwt', { session: false }), controller.updateRoleById)

routes.delete('/:id', passport.authenticate('jwt', { session: false }), controller.removeRoleById)

module.exports = routes