const Theater = require('../models/theater');
const Contract = require('../models/contract');
const TheaterReports = require('../models/theaterReports');
const DistributorReports = require('../models/distributorReports');

//Utils error
const errorHandler = require('../utils/errorHandler')

module.exports.createTheater = async function(req, res) {
    try {
        const theater = await new Theater({
            distId: req.body.distId,
            name: req.body.name,
            address: req.body.address,
            directorId: req.body.directorId,
            workTime: req.body.workTime,
            holes: req.body.holes,
            equipment: req.body.equipment,
            outAdv: req.body.outAdv,
            inAdv: req.body.inAdv,
            security: req.body.security,
            cashRegister: req.body.cashRegister,
            terminal: req.body.terminal,
            regionId: req.body.regionId,
            dcpCode: req.body.dcpCode,
            ticketLic: req.body.ticketLic,
            createdDate: Date.now(),
            createdBy: req.user.id,
        }).save()
        res.status(200).json(theater)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllTheater = async function(req, res) {
    try {
        const theater = await Theater.find({})
        res.status(200).json(theater)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getTheaterById = async function(req, res) {
    try {
        const theater = await Theater.findById(req.params.id)
        res.status(200).json(theater)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.updateTheaterById = async function(req, res) {
    try {
        const theater = await Theater.findOneAndUpdate({ _id: req.params.id }, { 
            $set: req.body,
            updatedDate: Date.now(),
            updatedBy: req.user.id
         }, { new: true })
        res.status(200).json(theater)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.removeTheaterById = async function(req, res) {
    try {
        var theaterId = req.body.theaterId;
        var deleteDistReport = req.body.deleteDistReport
        var updateDistReport = req.body.updateDistReport
        var deleteTheaterReports = req.body.deleteTheaterReports
        var contracts = req.body.contracts

        for(let i = 0; i < deleteDistReport.length; i++) {
            await DistributorReports.remove({ _id: deleteDistReport[i]._id })
        }
        for(let i = 0; i < updateDistReport.length; i++) {
            await DistributorReports.findOneAndUpdate({ _id: updateDistReport[i]._id }, { $set: updateDistReport[i] })
         }
         for(let i = 0; i < deleteTheaterReports.length; i++) {
            await TheaterReports.remove({ _id: deleteTheaterReports[i]._id })
         }

         for(let i = 0; i < contracts.length; i++) {
            await Contract.remove({ _id: contracts[i]._id })
         }

        // Delete Theater
        await Theater.remove({ _id: theaterId })
        res.status(200).json({ message: 'Кинотеатр была удалено' })
    } catch (e) {
        errorHandler(res, e)
    }
}