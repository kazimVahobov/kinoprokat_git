const mongoose = require('mongoose')
const Schema = mongoose.Schema

const distributorReports = new Schema({
    distId: { type: String, required: true },
    date: { type: String, required: true },
    sent: { type: Boolean },
    confirm: { type: Boolean },
    theaterReports: [
        {
            theaterReportsId: {
                type: String
            }
        }
    ],
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
            sessionCount: {
                type: Number
            },
            price: {
                type: Number
            },
            ticketCount: {
                type: Number
            }
        }
    ]
})

module.exports = mongoose.model('distributorReports', distributorReports)