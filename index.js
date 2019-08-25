const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
require('dotenv').config(); 

const port = process.env.PORT || 3000


// Connect to MongoDB
mongoose.connect(process.env.URI, {useNewUrlParser: true})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err))


// Set rendering engine
app.set('view engine', 'pug')


// Serve static Assets
app.use(express.static(path.join(__dirname, 'public')))


// Body Parser
app.use(express.urlencoded({extended: false}));
app.use(express.json());


// Routes
app.use('/', require('./routes/index'));
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));


// 404 Handler
app.use(function (req, res, next) {
    res.status(404).render('msg', {msg: "Sorry, can't find that!"})
})


// Run server
app.listen(port, () => {console.log(`Server listening on localhost:${port}`)})