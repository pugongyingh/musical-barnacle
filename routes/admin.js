const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const router = express.Router();
    
router.get('/', function(req, res) {
    res.render('admin/index')
})

router.get('/posts', function(req, res, next) {
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

router.get('/posts/add', function(req, res) {
    res.render('admin/add');
})

router.get('/posts/edit/:_id', function(req, res) {
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
    
module.exports = router;