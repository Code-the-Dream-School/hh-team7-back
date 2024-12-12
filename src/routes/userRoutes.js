const express = require('express');
const { register, login, logout, passwordResetRequest, passwordResetVerify, passwordResetUpdate, getUsers, updateUser, getUserById, deleteUser } = require('../controllers/userController');
const router = express.Router();

// API v1 Routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/password-reset/request').post(passwordResetRequest);
router.route('/password-reset/verify').post(passwordResetVerify);
router.route('/password-reset/update').post(passwordResetUpdate);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;