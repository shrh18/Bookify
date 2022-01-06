const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/users');

router.get('/signUp', users.renderSignUpForm);

router.post('/signUp', catchAsync(users.signUp));

router.get('/login', users.renderLoginForm);

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/seek', users.seekStart);

router.put('/seek', users.seekEnd);

router.get('/logout', users.logout);


module.exports = router;