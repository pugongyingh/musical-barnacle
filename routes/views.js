const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/', async function(req, res) {
    res.render(path.join(__dirname, '../views/index.pug'))
})

router.get('/admin', function(req, res) {
    res.sendFile(path.join(__dirname, '../views/admin.html'))
})

router.get('/items/:id', function(req, res) {
    res.render(path.join(__dirname, '../views/post.pug'))
})


module.exports = router;