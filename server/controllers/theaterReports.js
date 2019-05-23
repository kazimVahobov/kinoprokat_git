const TheaterReports = require('../models/theaterReports');
//Utils error
const errorHandler = require('../utils/errorHandler')

module.exports.createTheaterReports = async function(req, res) {
    try {
        const theaterReports = await new TheaterReports({
            theaterId: req.body.theaterId,
            date: req.body.date,
            withCont: req.body.withCont,
            withoutCont: req.body.withoutCont,
            sent: req.body.sent,
            confirm: req.body.confirm
        }).save()
        res.status(200).json(theaterReports)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllTheaterReports = async function(req, res) {
    try {
        const theaterReports = await TheaterReports.find({})
        res.status(200).json(theaterReports)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getTheaterReportsById = async function(req, res) {
    try {
        const theaterReports = await TheaterReports.findById(req.params.id)
        res.status(200).json(theaterReports)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getTheaterReportsByTheaterId = async function(req, res) {
    try {
        const theaterReports = await TheaterReports.find({ theaterId: req.params.id })
        res.status(200).json(theaterReports)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.filterTheaterReports = async function(req, res) {
    try {
        var _sent = !!req.body.sent;
        var _confirm = !!req.body.confirm;
        const theaterReports = await
        TheaterReports.find({sent: _sent, confirm: _confirm});
        res.status(200).json(theaterReports)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateTheaterReportsById = async function(req, res) {
    try {
        const theaterReports = await TheaterReports.findOneAndUpdate({ _id: req.params.id }, {$set: req.body}, { new: true })
        res.status(200).json(theaterReports)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.removeTheaterReportsById = async function(req, res) {
    try {
        await TheaterReports.remove({ _id: req.params.id })
        res.status(200).json({ message: 'Отчет кинотеатра была удалено' })
    } catch (e) {
        errorHandler(res, e)
    }
}