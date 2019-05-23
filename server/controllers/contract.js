const Contract = require('../models/contract');
//Utils error
const errorHandler = require('../utils/errorHandler')

module.exports.createContract = async function (req, res) {
    try {
        const contract = await new Contract({
            movieId: req.body.movieId,
            typeOfCont: req.body.typeOfCont,
            firstSide: req.body.firstSide,
            secondSide: req.body.secondSide,
            contNum: req.body.contNum,
            condition: req.body.condition,
            tax: req.body.tax,
            condPercent: req.body.condPercent,
            contDate: req.body.contDate,
            fromDate: req.body.fromDate,
            toDate: req.body.toDate,
            parentId: req.body.parentId,
            dayChildPriceTh: req.body.dayChildPriceTh,
            dayAdultPriceTh: req.body.dayAdultPriceTh,
            eveningChildPriceTh: req.body.eveningChildPriceTh,
            eveningAdultPriceTh: req.body.eveningAdultPriceTh,
            dayChildPriceGr: req.body.dayChildPriceGr,
            dayAdultPriceGr: req.body.dayAdultPriceGr,
            eveningChildPriceGr: req.body.eveningChildPriceGr,
            eveningAdultPriceGr: req.body.eveningAdultPriceGr,
            dayChildPriceMobile: req.body.dayChildPriceMobile,
            dayAdultPriceMobile: req.body.dayAdultPriceMobile,
            eveningChildPriceMobile: req.body.eveningChildPriceMobile,
            eveningAdultPriceMobile: req.body.eveningAdultPriceMobile
        }).save();
        res.status(200).json(contract)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllContract = async function (req, res) {
    try {
        const contract = await Contract.find({})
        res.status(200).json(contract)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getContractById = async function (req, res) {
    try {
        const contract = await Contract.findById(req.params.id)
        res.status(200).json(contract)
    } catch (e) {
        errorHandler(res, e)
    }
}


module.exports.updateContractById = async function (req, res) {
    try {
        const contract = await Contract.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
        res.status(200).json(contract)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.removeContractById = async function (req, res) {
    try {
        var contractId = req.body.contractId;
        var contracts = req.body.contracts
        if (contracts) {
            for (let i = 0; i < contracts.length; i++) {
                await Contract.remove({ _id: contracts[i]._id })
            }
        }
        // Delete Theater
        await Contract.remove({ _id: contractId })
        res.status(200).json({ message: 'Договор была удалено' })
    } catch (e) {
        errorHandler(res, e)
    }
}