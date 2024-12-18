const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const roles = require("../config/roles");
const {
  authorizeRoles,
  verifyRoleInDB,
} = require("../middleware/role-authorization");

router.post(
  "/",
  authorizeRoles([roles.ORGANIZER]),
  verifyRoleInDB([roles.ORGANIZER]),
  eventController.createEvent
);
router.get(
  "/",
  authorizeRoles([roles.ORGANIZER, roles.ATTENDEE]),
  eventController.getEvents
);
router.get(
  "/:id",
  authorizeRoles([roles.ORGANIZER, roles.ATTENDEE]),
  eventController.getEventById
);
router.put(
  "/:id",
  authorizeRoles([roles.ORGANIZER]),
  verifyRoleInDB([roles.ORGANIZER]),
  eventController.updateEvent
);
router.delete(
  "/:id",
  authorizeRoles([roles.ORGANIZER]),
  verifyRoleInDB([roles.ORGANIZER]),
  eventController.deleteEvent
);

module.exports = router;
