const express = require('express');
const { register, login, logout, passwordResetRequest, passwordResetVerify, passwordResetUpdate, getUsers, updateUser, getUserById, deleteUser } = require('../controllers/userController');
const router = express.Router();
const roles = require("../config/roles");
const {
  authorizeRoles,
  verifyRoleInDB,
} = require("../middleware/role-authorization");
const upload = require('../middleware/multerMiddleware');
const authMiddleware = require('./middleware/authentication');

// API v1 Routes
// public routes
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/logout').post(logout);
router.route('/password-reset/request').post(passwordResetRequest);
router.route('/password-reset/verify').post(passwordResetVerify);
router.route('/password-reset/update').post(passwordResetUpdate);

// Admin routes
router.get(
    '/',
    authorizeRoles([roles.ADMIN]),
    verifyRoleInDB([roles.ADMIN]),
    getUsers
  ); 
  
// user routes - both admins and the users themselves are allowed to update or delete their data.
router.get(
    '/:id', 
    authorizeRoles([roles.ADMIN, roles.USER]),
    verifyRoleInDB([roles.ADMIN, roles.USER]),    
    getUserById
  );
  
router.put(
    '/:id',
    authMiddleware,
    authorizeRoles([roles.USER]),
    verifyRoleInDB([roles.USER]),
    upload,
    updateUser
  );
  
router.delete(
    '/:id',
    authorizeRoles([roles.ADMIN, roles.USER]),
    verifyRoleInDB([roles.ADMIN, roles.USER]),
    deleteUser
  );

module.exports = router;