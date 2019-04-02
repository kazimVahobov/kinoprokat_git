const mongoose = require('mongoose')

const Schema = mongoose.Schema

var distributor = new Schema({
    name: { type: String, required: true },
    regionId: { type: String, required: true },
    address: { type: String },
    parentId: { type: String },
    phone: { type: String},
    email: { type: String },
    directorId: { type: String },
    createdDate: { type: String },
    updatedDate:  { type: String },
    createdBy:  { type: String },
    updatedBy:  { type: String }
})
module.exports = mongoose.model('distributor', distributor)