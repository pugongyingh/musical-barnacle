const express = require('express');
const path = require('path');
const router = express.Router();
const { ObjectID } = require('mongodb');
const getPosts = require('../utils/db');

(async () => {
    let posts = await getPosts();
    
    router.get('/', async function(req, res) {
        res.render(path.join(__dirname, '../views/index.pug'))
    })

    router.get('/posts', async function(req, res) {
        let postArray = await posts.find({}).toArray();
        res.render(path.join(__dirname, '../views/posts.pug'), {posts: postArray})
    })
    
    router.get('/posts/:id', async function(req, res) {
        let post = await posts.findOne({_id: ObjectID(req.params.id)});
        post ? res.render(path.join(__dirname, '../views/post.pug'), {...post}) : res.status(404)
    })
})()
    
module.exports = router;