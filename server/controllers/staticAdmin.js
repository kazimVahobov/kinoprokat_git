
const User = require('../models/users');
const Role = require('../models/role');

const bcrypt = require('bcryptjs');

//Utils error
const errorHandler = require('../utils/errorHandler')

module.exports.createStaticAdmin = async function (req, res) {
    try {

        //***** Create Guest right holder movie  *****/
        const guestMovieRole = await Role.findOne({ name: 'Guest Movie Role' })
        if(!guestMovieRole) {
            let guestPermissions = [
            ];

            const guestRole = await new Role({
                name: "Guest Movie Role",
                typeOfRole: "4",
                permissions: guestPermissions
            }).save()
        }
        //***** Create Static Role And User *****/
        const getRole = await Role.findOne({ name: 'Static Role' })
        if (!getRole) {

            let permissions = [
                {
                    value: 0,
                    groupName: "user",
                }, {
                    value: 1,
                    groupName: "user",
                }, {
                    value: 2,
                    groupName: "user",
                }, {
                    value: 3,
                    groupName: "user",
                }, {
                    value: 5,
                    groupName: "user",
                },
                {
                    value: 0,
                    groupName: "role",
                }, {
                    value: 1,
                    groupName: "role",
                }, {
                    value: 2,
                    groupName: "role",
                }, {
                    value: 3,
                    groupName: "role",
                },
                {
                    value: 0,
                    groupName: "movie",
                }, {
                    value: 1,
                    groupName: "movie",
                }, {
                    value: 2,
                    groupName: "movie",
                }, {
                    value: 3,
                    groupName: "movie",
                },
                {
                    value: 0,
                    groupName: "theater",
                }, {
                    value: 1,
                    groupName: "theater",
                }, {
                    value: 2,
                    groupName: "theater",
                }, {
                    value: 3,
                    groupName: "theater",
                }, 
                {
                    value: 0,
                    groupName: "region",
                }, {
                    value: 1,
                    groupName: "region",
                }, {
                    value: 2,
                    groupName: "region",
                }, {
                    value: 3,
                    groupName: "region",
                },
                {
                    value: 0,
                    groupName: "distributor",
                }, {
                    value: 1,
                    groupName: "distributor",
                }, {
                    value: 2,
                    groupName: "distributor",
                }, {
                    value: 3,
                    groupName: "distributor",
                },
                {
                    value: 0,
                    groupName: "cont-f",
                }, {
                    value: 1,
                    groupName: "cont-f",
                }, {
                    value: 2,
                    groupName: "cont-f",
                }, {
                    value: 3,
                    groupName: "cont-f",
                },
                {
                    value: 0,
                    groupName: "cont-s",
                }, {
                    value: 1,
                    groupName: "cont-s",
                }, {
                    value: 2,
                    groupName: "cont-s",
                }, {
                    value: 3,
                    groupName: "cont-s",
                }
                ,
                {
                    value: 0,
                    groupName: "cont-t",
                }, {
                    value: 1,
                    groupName: "cont-t",
                }, {
                    value: 2,
                    groupName: "cont-t",
                }, {
                    value: 3,
                    groupName: "cont-t",
                },
                {
                    value: 1,
                    groupName: "report-rkm",
                }, {
                    value: 4,
                    groupName: "report-rkm",
                }, {
                    value: 6,
                    groupName: "report-rkm",
                },
                {
                    value: 0,
                    groupName: "report-dist",
                }, {
                    value: 1,
                    groupName: "report-dist",
                }, {
                    value: 2,
                    groupName: "report-dist",
                }, {
                    value: 3,
                    groupName: "report-dist",
                }, {
                    value: 4,
                    groupName: "report-dist",
                }, {
                    value: 0,
                    groupName: "report-theater",
                }, {
                    value: 1,
                    groupName: "report-theater",
                }, {
                    value: 2,
                    groupName: "report-theater",
                }, {
                    value: 3,
                    groupName: "report-theater",
                },
            ]

            const role = await new Role({
                name: "Static Role",
                typeOfRole: "0",
                permissions: permissions
            }).save()

            const getUser = await User.findOne({ userName: "SuperAdmin" })
            if (!getUser) {

                const salt = bcrypt.genSaltSync(10)
                const password = "123123"

                const user = new User({
                    userName: "SuperAdmin",
                    password: bcrypt.hashSync(password, salt),
                    firstName: "Super Admin",
                    lastName: "Super Admin",
                    middleName: "Super Admin",
                    roleId: role._id
                }).save()
            }
        }
    } catch (e) {
        // errorHandler(500, e)
    }
}