const createError = require('http-errors');
const cors = require('cors');
const express = require('express');
const path = require('path');
const cookies = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const config = require('./config');
const {userMiddleware} = require('./core/user');
const indexRouter = require('./routes/index');
const instrumentsRouter = require('./routes/instruments');
const authRouter = require('./routes/auth');

const app = express();

const sessionParser = session({
    saveUninitialized: true,
    secret: config.session.secret,
});

const cookieParser = cookies();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, '../client-dist')));

if (config.isDevelopment()) {
    app.use(cors())
}

app.use(cookieParser);
app.use(sessionParser);
app.use(userMiddleware);

app.use('/_app', indexRouter);
app.use('/instruments', instrumentsRouter);
app.use('/auth', authRouter);


app.get('*',function (req, res) {
    res.sendFile(path.join(__dirname, '../client-dist/index.html'));
});

app.use(function (err, req, res) {
    res.status(err.status || 500).send(err.message);
});

module.exports = {app, sessionParser, cookieParser};
