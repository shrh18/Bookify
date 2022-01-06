const User = require('../models/user');

module.exports.renderSignUpForm = (req, res) => {
    res.render('users/signUp');
}

module.exports.signUp = async (req, res, next) => {
    try {
        const { email, username, area, password } = req.body;
        const user = new User({ email, username, area });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signUp');
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = (req.session.returnTo || '/campgrounds');
    // const redirectUrl = '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.seekStart = async(req, res) => { 
    await User.findByIdAndUpdate(req.user._id, {'seek' : true});
    const user = await User.findById(req.user._id);
    const uArea = user.area;
    const usname = req.user.username;
    const users = await User.find({'area' : uArea, 'seek' : true});
    res.render('seeklist', {users, usname});
}

module.exports.seekEnd = async(req, res) => {
    await User.findByIdAndUpdate(req.user._id, {'seek' : false});
    res.redirect('/');
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}