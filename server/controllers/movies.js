const Movie = require('../models/movies');

const Contract = require('../models/contract');
const TheaterReports = require('../models/theaterReports');
const DistributorReports = require('../models/distributorReports');

//Utils error
const errorHandler = require('../utils/errorHandler')

module.exports.createMovie = async function (req, res) {
    try {
        const movieData = JSON.parse(req.body['application']);
        const movie = await new Movie({
            name: movieData.name,
            originalName: movieData.originalName,
            country: movieData.country,
            language: movieData.language,
            yearMovie: movieData.yearMovie,
            studio: movieData.studio,
            director: movieData.director,
            genre: movieData.genre,
            comment: movieData.comment,
            premiereDate: movieData.premiereDate,
            actor: movieData.actor,
            formatVideo: movieData.formatVideo,
            formatAudio: movieData.formatAudio,
            recomAge: movieData.recomAge,
            regNum: movieData.regNum,
            createdDate: new Date(),
            createdBy: req.user.id,
            fileSrc: req['file']?req['file'].path:''
        }).save()
        res.status(200).json(movie)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getAllMovie = async function (req, res) {
    try {
        const movie = await Movie.find({})
        res.status(200).json(movie)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.getMovieById = async function (req, res) {
    try {
        const movie = await Movie.findById(req.params.id)
        res.status(200).json(movie)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.updateMovieById = async function (req, res) {
    try {
        const movieData = JSON.parse(req.body['application']);
        const movie = await Movie.findOneAndUpdate({ _id: req.params.id }, {
            $set: movieData,
            updatedDate: new Date(), updatedBy: req.user.id,
            fileSrc: req['file']?req['file'].path:''
        }, { new: true })
        res.status(200).json(movie)
    } catch (e) {
        errorHandler(res, e)
    }
}

module.exports.removeMovieById = async function (req, res) {
    try {
        var movieId = req.body.movieId;
        var deleteDistReport = req.body.deleteDistReport
        var updateDistReport = req.body.updateDistReport
        var deleteTheaterReports = req.body.deleteTheaterReports
        var updateTheaterReports = req.body.updateTheaterReports
        var contracts = req.body.contracts

        for (let i = 0; i < deleteDistReport.length; i++) {
            await DistributorReports.remove({ _id: deleteDistReport[i]._id })
        }
        for (let i = 0; i < updateDistReport.length; i++) {
            await DistributorReports.findOneAndUpdate({ _id: updateDistReport[i]._id }, { $set: updateDistReport[i] })
        }
        for (let i = 0; i < deleteTheaterReports.length; i++) {
            await TheaterReports.remove({ _id: deleteTheaterReports[i]._id })
        }
        for (let i = 0; i < updateTheaterReports.length; i++) {
            await TheaterReports.findOneAndUpdate({ _id: updateTheaterReports[i]._id }, { $set: updateTheaterReports[i] })
        }
        for (let i = 0; i < contracts.length; i++) {
            await Contract.remove({ _id: contracts[i]._id })
        }

        // Delete Movie
        await Movie.remove({ _id: movieId })
        res.status(200).json({ message: 'Кино была удалено' })
    } catch (e) {
        errorHandler(res, e)
    }
}