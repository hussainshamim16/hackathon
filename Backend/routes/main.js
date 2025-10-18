const express = require('express');
const router = express.Router();
  // routes/myRoutes.js
  router.get('/hello', (req, res) => {
    res.send('Hello from custom route!');
  });

  router.post('/data', (req, res) => {
    // Handle POST request logic here
    res.json({ message: 'Data received' });
  });

  // Chainable route handlers for a single path
  router.route('/users')
    .get((req, res) => {
      res.send('Get all users');
    })
    .post((req, res) => {
      res.send('Create a new user');
    });

  router.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    res.send(`Get user with ID: ${userId}`);
  });

    // routes/myRoutes.js
  module.exports = router;