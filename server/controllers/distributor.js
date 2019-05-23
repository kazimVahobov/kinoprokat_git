const Distributor = require('../models/distributor');
const Contract = require('../models/contract');
const TheaterReports = require('../models/theaterReports');
const DistributorReports = require('../models/distributorReports');
const Theater = require('../models/theater');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
//Utils error
const errorHandler = require('../utils/errorHandler')

module.exports.createDistributor = async function(req, res) {
    try {
        const distributor = await new Distributor({
            name: req.body.name,
            regionId: req.body.regionId,
            parentId: req.body.parentId,
            address: req.body.address,
            phone: req.body.phone,
            email: req.body.email,
            directorId: req.body.directorId,
            createdDate: new Date(),
            createdBy: req.user.id
        }).save()
        res.status(200).json(distributor)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getDistsByRegionId = async function(req, res) {
    try {
        const dists = await Distributor.find({regionId: req.params.id});
        res.status(200).json(dists)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllDistributor = async function(req, res) {
    try {
        const distributor = await Distributor.find({})
        res.status(200).json(distributor)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getDistributorById = async function(req, res) {
    try {
        const distributor = await Distributor.findById(req.params.id)
        res.status(200).json(distributor)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateDistributorById = async function(req, res) {
    try {
        const distributor = await Distributor.findOneAndUpdate({ _id: req.params.id }, {
             $set: req.body,
             updatedDate: new Date(),
             updatedBy: req.user.id
             }, { new: true })
        res.status(200).json(distributor)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.removeDistributorById = async function(req, res) {
    try {
        var distId = req.body.distId;
        var deleteDistReport = req.body.deleteDistReport
        var deleteTheaterReports = req.body.deleteTheaterReports
        var contracts = req.body.contracts
        var theaters = req.body.theaters

        for(let i = 0; i < deleteDistReport.length; i++) {
            await DistributorReports.remove({ _id: deleteDistReport[i]._id })
        }
         for(let i = 0; i < deleteTheaterReports.length; i++) {
            await TheaterReports.remove({ _id: deleteTheaterReports[i]._id })
         }

         for(let i = 0; i < contracts.length; i++) {
            await Contract.remove({ _id: contracts[i]._id })
         }

         for(let i = 0; i < theaters.length; i++) {
            await Theater.remove({ _id: theaters[i]._id })
         }

        // Delete Distributor
        await Distributor.remove({ _id: distId })
        res.status(200).json({ message: 'Дистрибутор была удалено' })
    } catch (e) {
        errorHandler(res, e)
    }
}