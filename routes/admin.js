const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../models/Post');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();

const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, function(req, res) {
    res.render('admin/index', {name: req.user.name})
})

router.get('/posts', ensureAuthenticated, function(req, res, next) {
    Post.find()
        .then(posts => {
            res.render('admin/posts', {posts})
        })
        .catch(e => {
            console.log(e);
            res.status(404);
            next();
        })
})

router.get('/posts/add', ensureAuthenticated, function(req, res) {
    res.render('admin/add');
})

router.get('/posts/edit/:_id', ensureAuthenticated, function(req, res) {
    Post.findOne({_id: req.params._id})
        .then(post => {
            const { title, author, content, pub_date } = post;
            res.render('admin/post', {
                _id: req.params._id,
                title,
                author,
                content,
                pub_date: pub_date.toISOString().slice(0, 10)
            });
        })
})

router.get('/users', ensureAuthenticated, function(req, res, next) {
    User.find()
        .then(users => {
            if(!users) {
                res.status(404);
                next();
            }

            res.render('admin/users', {users})
        })
})


// Auth Routes
router.get('/register', ensureAuthenticated, (req, res) => {
    res.render('admin/register', {success_msg: req.flash('success_msg')})
})

router.get('/login', (req, res) => {
    res.render('admin/login', {success_msg: req.flash('success_msg')});
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
        res.render('admin/register', {
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
                    res.render('admin/register', {
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
                                    res.redirect('/admin/login')
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
        failureRedirect: '/admin/login',
        failureFlash: true
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are now logged out');
    res.redirect('/admin/login');
})

module.exports = router;