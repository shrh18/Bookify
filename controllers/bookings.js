const Campground = require('../models/campground');

// BOOK
module.exports.bslot1 = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {'slot1.booked' : true, 'slot1.name': req.user._id });
    // res.redirect(`/campgrounds/${campground._id}`);
    res.render(`payment/checkout`);
}

module.exports.bslot2 = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {'slot2.booked' : true, 'slot2.name': req.user._id});
    // res.redirect(`/campgrounds/${campground._id}`);
    res.render(`payment/checkout`);
}

module.exports.bslot3 = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {'slot3.booked' : true, 'slot3.name': req.user._id});
    // res.redirect(`/campgrounds/${campground._id}`);
    res.render(`payment/checkout`);
}

module.exports.bslot4 = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {'slot4.booked' : true, 'slot4.name': req.user._id});
    // res.redirect(`/campgrounds/${campground._id}`);
    res.render(`payment/checkout`);
}

// UNBOOK
module.exports.ubslot1 = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {'slot1.booked' : false, 'slot1.name': null});
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.ubslot2 = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {'slot2.booked' : false, 'slot2.name': null});
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.ubslot3 = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {'slot3.booked' : false, 'slot3.name': null});
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.ubslot4 = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {'slot4.booked' : false, 'slot4.name': null});
    res.redirect(`/campgrounds/${campground._id}`);
}
