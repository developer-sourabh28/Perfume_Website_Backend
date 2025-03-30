const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const User = require('./routes/UserRoute');
const Post = require('./routes/PostRoute');
const Permission = require('./routes/permissionRoute');
const cors = require('cors');
const path = require('path');
const cart = require('./routes/cartRoute');
const logout = require('./routes/logoutRoute')
const Card = require('./routes/cardRoute');
const Rating = require('./routes/ratingRoute');
const Review = require('./routes/reviewRoute');

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

app.use(express.json());

app.use(session({
    secret : process.env.SECRET_KEY,
    resave : false,
    saveUninitialized : false,
    cookie:{
        secure : false,
        httpOnly : true,
        maxAge : 1000 * 60 * 60 * 24,
    }
}))

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['POST', 'GET', 'PUT', 'DELETE'],
    credentials: true,
}));

// Serve the 'uploads' folder statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch((err) => console.log(err));

app.use('/', User);
app.use('/', Post);
app.use('/permission', Permission);
app.use('/api', cart);
app.use('/api', logout);
app.use('/', Card);
app.use('/', Rating);
app.use('/', Review);

app.listen(PORT, () => {
    console.log(`server is running at port ${PORT}`);
});
