const express = require('express');
const router = express.Router();
const publicEventController = require('../controllers/publicEventController.js');

router.get('/', publicEventController.getAllEvents);
router.get("/:id", publicEventController.getEventById)

module.exports = router;