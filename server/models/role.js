const mongoose = require('mongoose')
const Schema = mongoose.Schema

const role = new Schema({
    name: { type: String, required: true },
    typeOfRole: { type: Number },
    permissions: [
        {
            value: {
            type: Number
          },
          groupName: {
            type: String
          }
        }
      ]
})

module.exports = mongoose.model('role', role)