const express = require('express');
const app = express();
const user = require('./src/routers/user');
const morgan = require('morgan');
const cors = require('cors');

// only require db.js if you want to connect to the database
const db = require('./db');
const ErrorHandler = require('./src/middlewares/ErrorHandler');


// Middleware
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());
app.use('/user', user);

app.use(ErrorHandler)


const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
});


