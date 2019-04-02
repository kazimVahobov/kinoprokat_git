const mongoose = require('mongoose')
const Schema = mongoose.Schema

const region = new Schema({
    name: { type: String, required: true },
    code: { type: String }
})

module.exports = mongoose.model('region', region)