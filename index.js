const express = require('express');
const app = express();
require('dotenv').config(); 

const path = require('path');
const port = process.env.PORT || 3000


// Set rendering engine
app.set('view engine', 'pug')


// Serve static Assets
app.use(express.static(path.join(__dirname, 'public')))


// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Routes
app.use('/', require('./routes/views'));
app.use('/api', require('./routes/api'));
app.use('/admin', require('./routes/admin'));


// Run server
app.listen(port, () => {console.log(`Server listening on localhost:${port}`)})