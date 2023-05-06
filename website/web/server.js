
const express = require('express');
const app = express();
const fs = require('fs');
const https = require('https');
const helmet = require("helmet");
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts');

const passport = require('passport');
const flash = require('connect-flash');

const port = 3000;

require('./config/passport')(passport);

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(session({
    secret: 'xquest',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
        secure: false,
    },
}));

app.use(expressLayouts);
app.set('view engine', 'ejs');

const mongoose = require('mongoose');
const { config } = require('process');
const mongo = require('./config/keys')
const db = require('./config/keys').MongoURI;

const options = {
    authSource: 'admin',
    user: mongo.mongoUser,
    pass: mongo.mongoPass,
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(db, options)
    .then(() => console.log('Mongoose connected'))
    .catch(err => console.log(err));

const base = `${__dirname}/public`;


app.use(flash());
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());


app.use(helmet.dnsPrefetchControl());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.originAgentCluster());
app.use(helmet.hsts());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());

app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));



app.get('/', function (req, res) {
    res.sendFile(`${base}/landing-page.html`);
});

app.get('/cards', ensureAuthenticated, (req, res) => {
    res.sendFile(`${base}/cards.html`);
});
app.get('/aboutProject', (req, res) => {
    res.sendFile(`${base}/aboutProject.html`);
});

app.get('/auditLogs', ensureAuthenticated, (req, res) => {
    res.sendFile(`${base}/auditLogs.html`);
});
app.get('/stats', ensureAuthenticated, (req, res) => {
    res.sendFile(`${base}/statistics.html`);
});
app.get('/dev', (req, res) => {
    res.sendFile(`${base}/developers.html`);
});
app.get('*', (req, res) => {
    res.sendFile(`${base}/404.html`);
});
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        // If user is authenticated, call next to proceed to the next middleware function
        return next();
    } else {
        // If user is not authenticated, redirect to the login page
        req.flash('error_msg', 'Please log in to view this page');
        res.redirect('/users/login');
    }
}