const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('index');
})

router.get('/posts', function(req, res) {
    Post.find()
        .then(posts => {
            res.render('posts', {posts})
        })
        .catch(e => console.error(e));
})

router.get('/posts/:_id', function(req, res, next) {
    Post.findOne({_id: req.params._id})
        .then(post => {
            res.render('post', {
                title: post.title,
                content: post.content,
                author: post.author,
                pub_date : post.pub_date,
                thumbnail: post.thumbnail
            })
        })
        .catch(e => {
            res.status(404);
            next();
        })
})
    
module.exports = router;