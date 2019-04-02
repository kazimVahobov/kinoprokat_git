const mongoose = require('mongoose')
const Schema = mongoose.Schema

var contract = new Schema({
    movieId: { type: String, required: true },
    typeOfCont: { type: Number, required: true },
    firstSide: { type: String, required: true },
    secondSide: { type: String, required: true },
    contNum: { type: String, required: true },
    condition: { type: Number, required: true },
    tax: { type: Number },
    condPercent: { type: Boolean, required: true },
    minPriceTicket: { type: String},
    contDate: { type: String, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    parentId: { type: String }
})
module.exports = mongoose.model('contract', contract)