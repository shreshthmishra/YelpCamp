const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database connected");
});


async function seedDb() {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const camp = new Campground({
            title: `${descriptors[Math.floor(Math.random() * descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`,
            location: `${cities[Math.floor(Math.random() * 100)].city}, ${cities[Math.floor(Math.random() * 100)].state} `
        });
        await camp.save();
    }
};

seedDb().then(() => {
    mongoose.connection.close();
})
    .catch(e => {
        console.log("Errorrrrrr " + e);
    })