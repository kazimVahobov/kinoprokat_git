const Region = require('../models/region');
//Utils error
const errorHandler = require('../utils/errorHandler')

module.exports.createRegion = async function(req, res) {
    try {
        const region = await new Region({
            name: req.body.name,
            code: req.body.code
        }).save()
        res.status(200).json(region)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllRegion = async function(req, res) {
    try {
        const region = await Region.find({})
        res.status(200).json(region)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getRegionById = async function(req, res) {
    try {
        const region = await Region.findById(req.params.id)
        res.status(200).json(region)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateRegionById = async function(req, res) {
    try {
        const region = await Region.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
        res.status(200).json(region)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.removeRegionById = async function(req, res) {
    try {
        await Region.remove({ _id: req.params.id })
        res.status(200).json({ message: 'Регион была удалено' })
    } catch (e) {
        errorHandler(res, e)
    }
}