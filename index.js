const express = require('express');
const app = express();
const user = require('./src/routers/user');
const post = require('./src/routers/post');
const morgan = require('morgan');
const cors = require('cors');

// only require db.js if you want to connect to the database
const db = require('./db');
const ErrorHandler = require('./src/middlewares/ErrorHandler');
var ip = require("ip");


// Middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
app.use('/user', user);
app.use('/post', post)
app.use(ErrorHandler)

app.get('/', (req, res) => {
    res.json({message: 'Hello World'});
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${ip.address()}:${port}`)
});


