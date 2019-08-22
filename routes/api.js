const express = require('express');
const { ObjectID } = require('mongodb');
const path = require('path');
const router = express.Router();
const getPosts = require('../utils/db');

(async () => {
    const posts = await getPosts();

    // Get
    router.get('/', async function(req, res) {
        res.send(await posts.find({}).toArray())
    })

    router.get('/:id', async function(req, res) {
        let obj = await posts.findOne({_id: ObjectID(req.params.id)});
        obj ? res.send(obj) : res.status(404);
    })

    // Create
    router.post('/', async function(req, res) {

        await posts.insertOne({
            title: req.body.title,
            content: req.body.content,
            author: req.body.author,
            pub_date: req.body.pub_date
        })

        res.status(201).render(path.join(__dirname, '../views/msg.pug'), {msg: 'Successfully added one post.'})
    })

    // Edit
    router.put('/:id', async function(req, res) {
        let changes = {}

        let data = {...req.body}
        
        if(data.title && typeof data.title === 'string') changes.title = data.title;
        if(data.content && typeof data.content === 'string') changes.content = data.content;
        if(data.author && typeof data.author === 'string') changes.author = data.author;
        if(data.pub_date && typeof data.pub_date === 'string') changes.pub_date = data.pub_date;

        let dbRes = await posts.updateOne({_id: ObjectID(req.params.id)}, {$set: {...changes}});

        res.status(200).send(dbRes);
    })


    // Delete
    router.delete('/:id', async function(req, res) {
        let obj = await posts.deleteOne({_id: ObjectID(req.params.id)})
        obj ? res.status(200) : res.status(404);
    })
})()

module.exports = router;