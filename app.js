if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const path = require('path');
const express = require('express');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const stripe = require('stripe')(process.env.STRIPE);

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');
const users = require('./routes/users');
const MongoDBStore = require('connect-mongo');
//const MongoDBStore = require('connect-mongodb-session')(session);

const port = process.env.PORT || 3000;

const YOUR_DOMAIN = `http://localhost:${port}`;

const dbUrl = process.env.DB_URL;
const localDb = dbUrl || 'mongodb://localhost:27017/YelpCamp';
mongoose.connect(localDb, {
    useNewUrlParser: true, 
    // useCreateIndex: true,
    useUnifiedTopology: true
    // useFindAndModify: true
});

const db = mongoose.connection;
db.on("error", console.log.bind(console, "connection error: "));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


// const store = new MongoDBStore({
//     url: localDb,
//     secret: 'thisshouldbeabettersecret!',
//     touchAfter: 24*3600
// });

// store.on("error", function(e){
//     console.log("SESSION STORE ERROR", e);
// })

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'
const sessionConfig = {
    //store,
    store: MongoDBStore.create({ mongoUrl: localDb }),
    name:'session',
    secret: secret ,
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

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', users);
app.use('/campgrounds', campgrounds);
app.use('/campgrounds/:id/reviews', reviews);

app.get('/', (req, res) => {
    res.render('home');
})

//PAYMENT
app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price: 'price_1KCevXSHX1sqCQhuzzMf102W',
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success.ejs`,
    cancel_url: `${YOUR_DOMAIN}/cancel.ejs`,
  });

    res.redirect(303, session.url);

})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found !', 404))
})

app.use((err, req, res, next) => {
    const {statusCode = 500} = err;
    if(!err.message) err.message = 'Something went wrong';
    res.status(statusCode).render('error', {err})
})


app.listen(port, () => {
    console.log(`serving on port ${port}`);
})