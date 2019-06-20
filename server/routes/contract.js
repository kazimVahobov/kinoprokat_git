const express = require('express');
const passport = require('passport')
const controller = require('../controllers/contract');

const routes = express.Router();

//http: //localhost:8080/api/contract
routes.post('/', passport.authenticate('jwt', { session: false }), controller.createContract)

routes.get('/', passport.authenticate('jwt', { session: false }), controller.getAllContract)

routes.get('/:id', passport.authenticate('jwt', { session: false }), controller.getContractById)

routes.put('/getByFilter', passport.authenticate('jwt', { session: false }), controller.getContractsByTypeAndSecondSide)

routes.put('/:id', passport.authenticate('jwt', { session: false }), controller.updateContractById)

routes.post('/delete', passport.authenticate('jwt', { session: false }), controller.removeContractById)


module.exports = routes