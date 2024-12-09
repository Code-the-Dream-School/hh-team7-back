const express = require('express');
const { register, login, logout, getUsers, updateUser, getUserById, deleteUser } = require('../controllers/userController');
const router = express.Router();

// API v1 Routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.get('/users', getUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

module.exports = router;