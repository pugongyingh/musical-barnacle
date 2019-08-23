const express = require('express');
const path = require('path');
const router = express.Router();
const { ObjectID } = require('mongodb');
const getPosts = require('../utils/db');

(async () => {
    let posts = await getPosts();
    
    router.get('/', async function(req, res) {
        res.render(path.join(__dirname, '../views/admin/index.pug'))
    })

    router.get('/posts', async function(req, res) {
        let postArray = await posts.find({}).toArray();
        res.render(path.join(__dirname, '../views/admin/posts.pug'), {posts: postArray})
    })
    
    router.get('/posts/add', async function(req, res) {
        res.render(path.join(__dirname, '../views/admin/add.pug'))
    })

    router.get('/posts/edit/:id', async function(req, res) {
        let post = await posts.findOne({_id: ObjectID(req.params.id)});
        res.render(path.join(__dirname, '../views/admin/post.pug'), {...post})
    })
})()
    
module.exports = router;