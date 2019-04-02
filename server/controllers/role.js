const Role = require('../models/role');
//Utils error
const errorHandler = require('../utils/errorHandler')

module.exports.createRole = async function(req, res) {
    try {
        const role = await new Role({
            name: req.body.name,
            typeOfRole: req.body.typeOfRole,
            permissions: req.body.permissions
        }).save()
        res.status(200).json(role)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllRole = async function(req, res) {
    try {
        const role = await Role.find({})
        res.status(200).json(role)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getRoleById = async function(req, res) {
    try {
        const role = await Role.findById(req.params.id)
        res.status(200).json(role)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateRoleById = async function(req, res) {
    try {
        const role = await Role.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
        res.status(200).json(role)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.removeRoleById = async function(req, res) {
    try {
        await Role.remove({ _id: req.params.id })
        res.status(200).json({ message: 'Рол была удалено' })
    } catch (e) {
        errorHandler(res, e)
    }
}