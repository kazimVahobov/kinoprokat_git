const DistributorReports = require('../models/distributorReports');
//Utils error
const errorHandler = require('../utils/errorHandler')

module.exports.createDistributorReports = async function(req, res) {
    try {
        const distributorReports = await new DistributorReports({
            distId: req.body.distId,
            date: req.body.date,
            mobileTheaters: req.body.mobileTheaters,
            sent: req.body.sent,
            confirm: req.body.confirm
        }).save()
        res.status(200).json(distributorReports)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllDistributorReports = async function(req, res) {
    try {
        const distributorReports = await DistributorReports.find({})
        res.status(200).json(distributorReports)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getDistributorReportsById = async function(req, res) {
    try {
        const distributorReports = await DistributorReports.findById(req.params.id)
        res.status(200).json(distributorReports)
    } catch (e) {
        errorHandler(res, e)
    }
}
module.exports.getDistributorReportsByDistId = async function(req, res) {
    try {
        const distributorReports = await DistributorReports.find({ distId: req.params.id })
        res.status(200).json(distributorReports)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.updateDistributorReportsById = async function(req, res) {
    try {
        const distributorReports = await DistributorReports.findOneAndUpdate(
            { _id: req.params.id }, {$set: req.body}, { new: true })
        res.status(200).json(distributorReports)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.removeDistributorReportsById = async function(req, res) {
    try {
        await DistributorReports.remove({ _id: req.params.id })
        res.status(200).json({ message: 'Отчет дистрибутора была удалено' })
    } catch (e) {
        errorHandler(res, e)
    }
}