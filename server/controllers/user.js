const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const keys = require('../config/config')
const User = require('../models/users');
//Utils error
const errorHandler = require('../utils/errorHandler')

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({ userName: req.body.userName })

    if (candidate) {
        //Проверка пароля, пользователь сушестует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);

        if (passwordResult) {
            //Генерация токена, пароли совпали
            const token = jwt.sign({
                userName: candidate.userName,
                userId: candidate._id
            }, keys.jwt, { expiresIn: '12h' })

            res.status(200).json({ userId: candidate._id, exp: '12', token: `Bearer ${token}` })
        } else {
            //Пароли не совпали
            res.status(409).json({ message: 'Пароли не совпадают. Попробуйте снова.' })
        }
    } else {
        //Пользователь нет, ошибка
        res.status(404).json({ message: 'Ползователь с таким Login не найден' })
    }
}
module.exports.register = async function (req, res) {
    const candidate = await User.findOne({ userName: req.body.userName })

    if (candidate) {
        //Пользователь сушествует, нужно отправить ошибку
        res.status(409).json({
            message: 'Такой login уже занят'
        })
    } else {
        //хеширование и зашита пароля
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        //нужно создать пользователя
        const user = new User({
            userName: req.body.userName,
            password: bcrypt.hashSync(password, salt),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            middleName: req.body.middleName,
            phone: req.body.phone,
            email: req.body.email,
            theaterId: req.body.theaterId,
            distId: req.body.distId,
            movieId: req.body.movieId,
            imageSrc: req.file ? req.file.path : '',
            roleId: req.body.roleId
        })
        try {
            await user.save()
            res.status(200).json(user)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}
module.exports.changePassword = async function (req, res) {
    const candidate = await User.findOne({ userName: req.body.userName })

    if (candidate) {
        //Проверка пароля, пользователь сушестует
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password);

        if (passwordResult) {
            //хеширование и зашита пароля
            const salt = bcrypt.genSaltSync(10)
            const password = req.body.newPassword
            const user = await User.findOneAndUpdate({ userName: candidate.userName }, { password: bcrypt.hashSync(password, salt) }, { new: true })
            res.status(200).json(user)
        } else {
            //Пароли не совпали
            res.status(400).json({ message: 'Пароли не совпадают. Попробуйте снова.' })
        }
    } else {
        //Пользователь нет, ошибка
        res.status(404).json({ message: 'Ползователь с таким Login не найден' })
    }
}
module.exports.droppingPassword = async function (req, res) {
    try {
        //хеширование и зашита пароля
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = await User.findOneAndUpdate({ _id: req.body._id }, { password: bcrypt.hashSync(password, salt) }, { new: true })
        res.status(200).json(user)
    } catch (e) {
        errorHandler(res, e)
    }
}
module.exports.getAllUser = async function (req, res) {
    try {
        const user = await User.find({})
        res.status(200).json(user)
    } catch (e) {
        errorHandler(res, e)
    }
}
module.exports.getUserById = async function (req, res) {
    try {
        const user = await User.findById(req.params.id)
        res.status(200).json(user)
    } catch (e) {
        errorHandler(res, e)
    }
}
module.exports.removeUserById = async function (req, res) {
    try {
        await User.remove({ _id: req.params.id })
        res.status(200).json({ message: 'User была удалено' })
    } catch (e) {
        errorHandler(res, e)
    }
}
module.exports.updateUserById = async function (req, res) {

    if (req.file) {
        var updated = req.file.path;
        try {
            const user = await User.findOneAndUpdate({ _id: req.params.id }, { imageSrc: updated }, { new: true })
            res.status(200).json(user)
        } catch (e) {
            errorHandler(res, e)
        }
    } else {
        try {
            const user = await User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true })
            res.status(200).json(user)
        } catch (e) {
            errorHandler(res, e)
        }
    }
}
