

// Express Variables
const express = require('express');
const app = express();



// require Apps
require('dotenv').config();
const port =  process.env.PORT || 4000;

// require Apps
const mongoose = require('mongoose');
const cors = require('cors');

// My Routes
const userRoutes = require('./routes/main')
app.use('/', userRoutes);


// mongooDB connect
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB Atlas!');
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
})
.catch((err) => {
    console.error('MongoDB Atlas connection error:', err);
});


app.get('/', (req, res) => {
res.send('Hello from custom route!');
});


app.listen(port, () => {
console.log(`Example app listening on port ${port}`);
})
