const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000


// Passport Config
require('./config/passport')(passport);


// Configure `.env`
require('dotenv').config();


// Connect to MongoDB
mongoose.connect(process.env.URI, {useNewUrlParser: true})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))


// Set rendering engine
app.set('view engine', 'pug')


/** Middleware **/

// Serve static Assets
app.use(express.static(path.join(__dirname, 'public')))


// Bodyparser
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// Express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// Connect Flash
app.use(flash());


// Global Vars
app.use((req, res, next) => { 
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})



/** Routes **/
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));


// 404 Handler
app.use(function (req, res, next) {
    res.status(404).render('msg', {msg: "Sorry, can't find that!"})
})


/** Run server **/
app.listen(port, () => console.log(`Server listening on localhost:${port}`))