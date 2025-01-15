const express = require('express');
const { register, login, logout, passwordResetRequest, passwordResetVerify, passwordResetUpdate, getUsers, updateMyUser, getUserById, deleteUser, updateAnyUser } = require('../controllers/userController');
const router = express.Router();
const { ROLES } = require("../config/enums");
const {
  authorizeRoles,
  verifyRoleInDB,
} = require("../middleware/role-authorization");
const { upload, uploadToCloudinary } = require('../middleware/multerMiddleware');
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
    authMiddleware,
    authorizeRoles([ROLES.ADMIN]),
    verifyRoleInDB([ROLES.ADMIN]),
    getUsers
  ); 
  
router.get(
    '/:id',    
    authMiddleware,
    getUserById
  );
  
// user routes - only users are allowed to update user data.
router.put(
    '/:id',
    authMiddleware,
    upload,
    uploadToCloudinary,
    updateMyUser
  );
  
router.delete(
    '/:id',
    authMiddleware,
    authorizeRoles([ROLES.ADMIN]),
    verifyRoleInDB([ROLES.ADMIN]),
    deleteUser
  );

router.put(
  '/user/:id',
  authMiddleware,
  authorizeRoles([ROLES.ADMIN]),
  verifyRoleInDB([ROLES.ADMIN]),
  upload,
  uploadToCloudinary,
  updateAnyUser
);

module.exports = router;