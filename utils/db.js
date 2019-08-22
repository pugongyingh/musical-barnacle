const {MongoClient} = require('mongodb');

let db, posts;

async function init() {   
    let uri = process.env.URI
    const client = await MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    return await client.db('cms');
}

async function getPosts() {
    if (!db) {
        db = await init();
    }

    if (!posts) {
        posts = db.collection('posts');
    }
    return posts;
}


module.exports = getPosts;