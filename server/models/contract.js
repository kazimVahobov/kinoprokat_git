const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var contract = new Schema({
    movieId: { type: String, required: true },
    typeOfCont: { type: Number, required: true },
    firstSide: { type: String, required: true },
    secondSide: { type: String, required: true },
    contNum: { type: String, required: true },
    condition: { type: Number, required: true },
    tax: { type: Number },
    condPercent: { type: Boolean, required: true },
    contDate: { type: String, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    parentId: { type: String },
    // prices
    dayChildPriceTh: {type: String},
    dayAdultPriceTh: {type: String},
    eveningChildPriceTh: {type: String},
    eveningAdultPriceTh: {type: String},
    dayChildPriceGr: {type: String},
    dayAdultPriceGr: {type: String},
    eveningChildPriceGr: {type: String},
    eveningAdultPriceGr: {type: String},
    dayChildPriceMobile: {type: String},
    dayAdultPriceMobile: {type: String},
    eveningChildPriceMobile: {type: String},
    eveningAdultPriceMobile: {type: String}
});
module.exports = mongoose.model('contract', contract);