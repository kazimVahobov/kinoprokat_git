const mongoose = require('mongoose')
const Schema = mongoose.Schema

const theater = new Schema({
  distId: { type: String },
  name: { type: String, required: true },
  directorId: { type: String },
  address: { type: String },
  workTime: [
    {
      start: {
        type: String
      },
      end: {
        type: String
      },
      weekDay: {
        type: Boolean
      }
    }
  ],
  holes: [
    {
      name: {
        type: String
      },
      placeCount: {
        type: Number
      }
    }
  ],
  equipment: { type: String },
  regionId: { type: String, required: true },
  dcpCode: { type: String },
  outAdv: { type: String },
  inAdv: { type: String },
  security: { type: String },
  cashRegister: { type: Boolean },
  terminal: { type: Boolean },
  ticketLic: { type: Boolean },
  createdDate: { type: String },
  updatedDate:  { type: String },
  createdBy:  { type: String },
  updatedBy:  { type: String }
})

module.exports = mongoose.model('theater', theater)