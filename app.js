const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');


const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/review');

// copied from mongoose documentations
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

// copied from mongoose documentations
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected");
});

const app = express();

app.use(express.urlencoded({ extended: true })); // It parses incoming requests
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// Authentication stuff from passport docs
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

// It is used so we don't need to pass messages which we want to flash every time
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')) // so that I can access views even if I don't start my app from YelpCamp directory

app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', function (req, res) {
    res.render('home');
});

app.all('*', function (req, res, next) {
    next(new ExpressError('Page Not Found', 404));
});

app.use(function (err, req, res, next) {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong';
    res.status(statusCode).render('error', { err });
});

app.listen(3000, function (req, res) {
    console.log('Port is listening on 3000');
});