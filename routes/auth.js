const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const User = require('../models/User');
const { ensureAuthenticated } = require('../auth/auth');


router.get('/register', ensureAuthenticated, (req, res) => {
    res.render('auth/register', {success_msg: req.flash('success_msg')})
})

router.get('/login', (req, res) => {
    res.render('auth/login', {success_msg: req.flash('success_msg')});
})

// Register Handle
router.post('/register', (req, res) => {
    const {name, email, password, password2} = req.body;
    let errors = [];

    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({msg: "Please fill in all fields"})
    }

    // Check Passwords Match
    if(password !== password2) {
        errors.push({msg: "Passwords do not match"})
    }

    // Check Password Length
    if(password.length < 8) {
        errors.push({msg: "Password should be at least 6 characters"});
    }

    if(errors.length > 0) {
        res.render('auth/register', {
            errors,
            name,
            email,
            password,
            password2
        })
    } else {
        // Validation Passed
        User.findOne({ email: email })
            .then(user => {
                if(user) {
                    // User exists
                    errors.push({msg: "Email is already registered"})
                    res.render('auth/register', {
                        errors,
                        name,
                        email,
                        password,
                        password2
                    })
                } else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    })

                    // Hash Password
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            newUser.password = hash;
                            // Save User
                            newUser.save()
                                .then(user => {
                                    req.flash('success_msg', 'You are now registered and can log in')
                                    res.redirect('/auth/login')
                                })
                                .catch(e => console.log(e))
                        })
                    })
                }
            });
    }
});

// Login Handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/auth/login');
})

module.exports = router;