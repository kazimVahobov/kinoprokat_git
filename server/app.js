const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/config');
const winston = require('./config/winston');
var morgan = require('morgan')
//Роуты
const userRoutes = require('./routes/user');
const theaterRoutes = require('./routes/theater')
const moviesRoutes = require('./routes/movies')
const distributorRoles = require('./routes/distributor')
const roleRoutes = require('./routes/role')
const regionRoutes = require('./routes/region')
const contractRoutes = require('./routes/contract')
const theaterReportsRoutes = require('./routes/theaterReports')
const distributorReportsRoutes = require('./routes/distributorReports')

const staticAdmin = require('./controllers/staticAdmin');

const app = express();

//подключение к базу даных
mongoose.connect(keys.mongoURI)
    .then(() => console.log('MongoDB connected.'))
    .catch((err) => console.log(err))

//Добавление статический админа
staticAdmin.createStaticAdmin();

//Console morgan
app.use(morgan('combined', { stream: winston.stream }));

//Зашита роутинга
app.use(passport.initialize())
require('./middleware/passport')(passport)
//CORS
app.use(require('cors')())
//Uploads Image
app.use('/uploads', express.static('uploads'))
//Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Роуты
app.use('/api/user', userRoutes)
app.use('/api/theater', theaterRoutes)
app.use('/api/movie', moviesRoutes)
app.use('/api/distributor', distributorRoles)
app.use('/api/role', roleRoutes)
app.use('/api/region', regionRoutes)
app.use('/api/contract', contractRoutes)
app.use('/api/theater-report', theaterReportsRoutes)
app.use('/api/distributor-report', distributorReportsRoutes)
var path = require('path');
app.use(express.static('client/dist/client'))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname +  '/client/dist/client/index.html'))})

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Server Working!'
    })
});

const port = process.env.PORT || keys.PORT;

app.listen(port, () => console.log(`Server has been started on ${port}`))
