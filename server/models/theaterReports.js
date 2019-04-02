const mongoose = require('mongoose')
const Schema = mongoose.Schema

const theaterReports = new Schema({
    theaterId: { type: String, required: true },
    date: { type: String, required: true },
    sent: { type: Boolean },
    confirm: { type: Boolean },
    withCont: [
        {
            movieId: {
                type: String
            },
            contractId: {
                type: String
            },
            holeId: {
                type: String
            },
            sessionTime: {
                type: String
            },
            price: {
                type: Number
            },
            ticketCount: {
                type: Number
            }
        }
    ],
    withoutCont: [
        {
            movie: {
                type: String
            },
            distributor: {
                type: String
            },
            country: {
                type: String
            },
            sessionCount: {
                type: Number
            }
        }
    ]
})

module.exports = mongoose.model('theaterReports', theaterReports)