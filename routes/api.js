const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const router = express.Router();

async function loadPosts() {   
    let uri = 'mongodb+srv://root:Gr33nk1d5@cluster0-urxt4.mongodb.net/test?retryWrites=true&w=majority'
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    return client.db('cms').collection('posts');
}

(async () => {
    const posts = await loadPosts();

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
            pub_date: req.body.pub_date || new Date()
        })
        res.status(201);
    })

    // Edit
    router.put('/:id', async function(req, res) {
        let changes = {}

        let data = {...req.body}
        
        if(data.title) changes.title = data.title;
        if(data.content) changes.content = data.content;
        if(data.author) changes.author = data.author;
        if(data.pub_date) changes.pub_date = data.pub_date;

        let dbRes = await posts.updateOne({_id: ObjectID(req.params.id)}, {$set: {...changes}});

        res.send(dbRes);
    })


    // Delete
    router.delete('/:id', async function(req, res) {
        let obj = await posts.deleteOne({_id: ObjectID(req.params.id)})
        obj ? res.status(200) : res.status(404);
    })
})()

module.exports = router;