const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String },
  theaterId: { type: String },
  distId: { type: String },
  movieId: { type: String },
  phone: { type: String },
  email: { type: String },
  roleId: { type: String},
  imageSrc: {
    type: String,
    default: ''
  }
})

module.exports = mongoose.model('users', userSchema)