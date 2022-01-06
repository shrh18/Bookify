const express = require('express');
const router = express.Router();
const campgrounds = require('../controllers/campgrounds');
const bookings = require('../controllers/bookings');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError');


router.get('/', catchAsync(campgrounds.index));

router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('/', isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));

router.get('/:id', catchAsync(campgrounds.showCampground));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

// UPDATE
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.editCampground));

// BOOK
router.put('/:id/book/slot1', isLoggedIn, bookings.bslot1);

router.put('/:id/book/slot2', isLoggedIn, bookings.bslot2);

router.put('/:id/book/slot3', isLoggedIn, bookings.bslot3);

router.put('/:id/book/slot4', isLoggedIn, bookings.bslot4);

// UNBOOK
router.put('/:id/unbook/slot1', isLoggedIn, bookings.ubslot1);

router.put('/:id/unbook/slot2', isLoggedIn, bookings.ubslot2);

router.put('/:id/unbook/slot3', isLoggedIn, bookings.ubslot3);

router.put('/:id/unbook/slot4', isLoggedIn, bookings.ubslot4);

// DELETE
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;