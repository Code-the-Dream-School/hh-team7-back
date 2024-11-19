const express = require('express');
const { createUser, getUser, updateUser } = require('../controllers/userController');
const router = express.Router();

// API v1 Routes
router.post('/users', createUser);
router.get('/users', getUser);
router.put('/users', updateUser);

module.exports = router;