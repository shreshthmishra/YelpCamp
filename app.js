const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Campground = require('./models/campground');

// copied from mongoose documentations
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

// copied from mongoose documentations
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected");
});

const app = express();

app.use(express.urlencoded({ extended: true })); // It parses incoming requests

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')) // so that I can access views even if I don't start my app from YelpCamp directory

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/campgrounds', async function (req, res) {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
});

app.get('/campgrounds/:id', async function (req, res) {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', { campground });
});

app.listen(3000, function (req, res) {
    console.log('Port is listening on 3000');
});


