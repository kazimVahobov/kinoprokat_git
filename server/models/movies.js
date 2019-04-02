const mongoose = require('mongoose')
const Schema = mongoose.Schema

const movie = new Schema({
    name: { type: String, required: true },
    originalName: { type: String, required: true },
    country: { type: String, required: true },
    language: { type: String, required: true },
    yearMovie: { type: String, required: true },
    studio: { type: String, required: true },
    director: { type: String, required: true },
    genre: { type: String },
    comment: { type: String },
    premiereDate: { type: Date },
    actor: { type: String },
    formatVideo: { type: String },
    formatAudio: { type: String },
    recomAge: { type: Number },
    regNum: { type: String },
    createdDate: { type: String },
    updatedDate:  { type: String },
    createdBy:  { type: String },
    updatedBy:  { type: String },
    fileSrc: {
        type: String,
        default: ''
      }
})

module.exports = mongoose.model('movie', movie)