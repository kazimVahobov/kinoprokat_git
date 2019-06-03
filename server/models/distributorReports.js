const mongoose = require('mongoose')
const Schema = mongoose.Schema

const distributorReports = new Schema({
    distId: { type: String, required: true },
    date: { type: String, required: true },
    sent: { type: Boolean },
    confirm: { type: Boolean },
    mobileTheaters: [
        {
            movieId: {
                type: String
            },
            place: { //Adress
                type: String
            },
            time: {
                type: String
            },
            contId: {
                type: String
            },
            daySession: {
                type: Boolean
            },
            childTicketCount: {
                type: Number
            },
            adultTicketCount: {
                type: Number
            },
            childTicketPrice: {
                type: Number
            },
            adultTicketPrice: {
                type: Number
            }
        }
    ]
})

module.exports = mongoose.model('distributorReports', distributorReports)
