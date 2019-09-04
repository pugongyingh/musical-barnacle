const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: "default.png"
    },
    pub_date: {
        type: Date,
        default: Date.now
    },
})

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;