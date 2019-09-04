const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const User = require('../models/User');
const router = express.Router();

const { ensureAuthenticated } = require('../auth/auth');

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
    res.render('admin/add', {errors: req.flash('errors')});
})

router.get('/posts/edit/:_id', ensureAuthenticated, function(req, res) {
    Post.findOne({_id: req.params._id})
        .then(post => {
            const { title, author, content, pub_date, thumbnail } = post;
            res.render('admin/post', {
                _id: req.params._id,
                title,
                author,
                content,
                pub_date: pub_date.toISOString().slice(0, 10),
                thumbnail
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

module.exports = router;