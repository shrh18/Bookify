const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/YelpCamp', {
    useNewUrlParser: true, 
    // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDB = async() => {
    await Campground.deleteMany({});
    for(let i=0; i<10; i++){
        const random1k = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20 + 10);
        const camp = new Campground({
            location: `${cities[random1k].city}, ${cities[random1k].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://source.unsplash.com/collection/483251",
            description: 'lorem ipsum blah blah blah',
            price: price,
            slot1: false,
            slot2: false,
            slot3: false,
            slot4: false
        })
        await camp.save();
    }   
}

seedDB().then(() => {
    mongoose.connection.close();
})