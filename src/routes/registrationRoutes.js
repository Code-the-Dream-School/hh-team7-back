const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');


router.post('/registrations', registrationController.createRegistration);
router.get('/registrations', registrationController.getRegistrations);
router.get('/registrations/:id', registrationController.getRegistrationById);
router.put('/registrations/:id', registrationController.updateRegistration);
router.delete('/registrations/:id', registrationController.deleteRegistration);

module.exports = router;