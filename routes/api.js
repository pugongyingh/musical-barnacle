const express = require('express');
const mongoose = require('mongoose');
const Post = require('../models/Post');
const router = express.Router();

// Read
router.get('/', function(req, res) {
    Post.find()
        .then(posts => {
            res.send(posts)
        })
        .catch(e => console.error(e));
})

router.get('/post_:_id', function(req, res, next) {
    Post.findOne({_id: req.params._id})
        .then(post => {
            res.send(post);
        })
        .catch(e => {
            console.log(e);
            res.status(404);
            next();
        })
})

// Create
router.post('/', function(req, res) {

    const newPost = new Post({
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        pub_date: req.body.pub_date
    })
    newPost.save()
        .then(res => res.status(201).send(newPost))
        .catch(e => {
            console.log(e)
            res.send(e)
        })

})

// Update
router.put('/post_:_id', function(req, res, next) {
    /* Validate */
    const {title, author, content, pub_date} = req.body;

    let changes = {};

    if(title) changes.title = title;
    if(author) changes.author = author;
    if(content) changes.content = content;
    if(pub_date) changes.pub_date = pub_date;

    Post.updateOne({_id: req.params._id}, {...changes})
        .then(response => {
            // Post exists
            res.status(201).send({msg: "Successfully updated one post"})
        })
        .catch(error => {
            // Post does not exist
            console.log(error);
            res.status(404);
            next();
        })

       
})


// Delete
router.delete('/post_:_id', function(req, res, next) {
    Post.deleteOne({_id: req.params._id})
        .then(() => {
            res.status(200).send({msg: "Deleted One Post"})
        })
        .catch(e => {
            console.log(e);

            res.status(404);
            next();
        })
})

module.exports = router;