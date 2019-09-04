const express = require('express');
const router = express.Router();

const utils = require('../utils/utils');

const mongoose = require('mongoose');
const Post = require('../models/Post');

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function(req, file, cb) {
        let ext = file.mimetype.split('/')[1];
        cb(null, `${utils.generateId()}.${ext}`);
    }
})
const upload = multer({storage})

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
router.post('/', upload.single('thumbnail'), function(req, res) {
    const newPost = {
        title: req.body.title,
        content: req.body.content,
        author: req.body.author,
        pub_date: req.body.pub_date,
        thumbnail: req.file.filename,
    }

    const errors = utils.validatePost(newPost);

    if (errors.length > 0) {
        req.flash({errors});
        res.redirect('./');
    } else {
        newPost = new Post(newPost)
        newPost.save()
            .then(post => {
                res.status(201)
                if(req.accepts('html')) {
                    res.redirect('/posts/'+post._id);
                }
                else {
                    res.send(post)
                }
            })
            .catch(error => {
                console.log(error);
    
                if(req.accepts('html')) {
                    let arr = Object.keys(error.errors);
                    let errList = arr.map(t => { return {msg: error.errors[t].message}});
                    req.flash('errors', errList);
                    res.redirect('/admin/posts/add');
                }
                else {
                    res.send(error);
                }
            })
    }
})

// Update
router.put('/post_:_id', upload.single('thumbnail'), function(req, res, next) {
    // Process Images
    
    /* Validate */
    const {title, author, content, pub_date} = req.body;
    const thumbnail = req.file ? req.file.filename : null;


    let changes = {};

    if(title) changes.title = title;
    if(author) changes.author = author;
    if(content) changes.content = content;
    if(pub_date) changes.pub_date = pub_date;
    if(thumbnail) changes.thumbnail = thumbnail;

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

// Upload
router.post('/upload', upload.single('img'), function(req, res) {
    res.status(201).send(req.file.filename)
})
module.exports = router;