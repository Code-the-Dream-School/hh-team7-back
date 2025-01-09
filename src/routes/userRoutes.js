const express = require('express');
const { register, login, logout, passwordResetRequest, passwordResetVerify, passwordResetUpdate, getUsers, updateUser, getUserById, deleteUser } = require('../controllers/userController');
const router = express.Router();
const { ROLES } = require("../config/enums");
const {
  authorizeRoles,
  verifyRoleInDB,
} = require("../middleware/role-authorization");
const upload = require('../middleware/multerMiddleware');
const authMiddleware = require('../middleware/authentication');

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
    authorizeRoles([ROLES.ADMIN]),
    verifyRoleInDB([ROLES.ADMIN]),
    getUsers
  ); 
  
// user routes - only admins are allowed to get user data.
router.get(
    '/:id',    
    authorizeRoles([ROLES.ADMIN]),
    verifyRoleInDB([ROLES.ADMIN]),
    getUserById
  );
  
// user routes - only users are allowed to update user data.
router.put(
    '/:id',
    authMiddleware,
    upload,
    updateUser
  );
  
router.delete(
    '/:id',
    deleteUser
  );

module.exports = router;