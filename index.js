const express = require('express');
const app = express();

const path = require('path');
const port = process.env.PORT || 3000

const views = require('./routes/views');
const api = require('./routes/api');


// Set rendering engine
app.set('view engine', 'pug')


// Serve static Assets
app.use(express.static(path.join(__dirname, 'public')))


// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Routes
app.use('/api', api);
app.use('/', views);


// Run server
app.listen(port, () => {console.log(`Server listening on localhost:${port}`)})