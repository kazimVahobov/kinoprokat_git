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
            dayChildTicketCount: {
                type: Number
            },
            dayAdultTicketCount: {
                type: Number
            },
            eveningChildTicketCount: {
                type: Number
            },
            eveningAdultTicketCount: {
                type: Number
            },
            dayChildTicketPrice: {
                type: Number
            },
            dayAdultTicketPrice: {
                type: Number
            },
            eveningChildTicketPrice: {
                type: Number
            },
            eveningAdultTicketPrice: {
                type: Number
            },
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