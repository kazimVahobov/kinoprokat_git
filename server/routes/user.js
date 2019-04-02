const express = require('express');
const passport = require('passport')
const controller = require('../controllers/user');
const upload = require('../middleware/uploadAvatar')

const routes = express.Router();

//http://localhost:8080/api/user/login

routes.post('/login',  controller.login)
    //http: //localhost:8080/api/user/register
routes.post('/register',  passport.authenticate('jwt', { session: false }), controller.register)
    //GET ALL USERS http: //localhost:8080/api/user/
routes.get('/', passport.authenticate('jwt', { session: false }),  controller.getAllUser)
    //GET BY ID USERS http: //localhost:8080/api/user/
routes.get('/:id', passport.authenticate('jwt', { session: false }), controller.getUserById)
    //REMOVE USERS BY ID http: //localhost:8080/api/user/
routes.delete('/:id', passport.authenticate('jwt', { session: false }), controller.removeUserById)
    //UPDATE USERS BY ID http: //localhost:8080/api/user/users
routes.put('/:id', passport.authenticate('jwt', { session: false }), upload.single('image'), controller.updateUserById)

    //UPDATE USERS Pass BY Pass http: //localhost:8080/api/user/changePass
routes.post('/changePass', passport.authenticate('jwt', { session: false }), controller.changePassword)

    //UPDATE USERS Pass BY Pass http: //localhost:8080/api/user/droppingPass
routes.post('/droppingPass', passport.authenticate('jwt', { session: false }), controller.droppingPassword)

module.exports = routes