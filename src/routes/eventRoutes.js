const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { ROLES } = require("../config/enums");
const {
  authorizeRoles,
  verifyRoleInDB,
} = require("../middleware/role-authorization");
const { upload, uploadToCloudinary } = require('../middleware/multerMiddleware');

router.post(
  "/",
  authorizeRoles([ROLES.ORGANIZER]),
  verifyRoleInDB([ROLES.ORGANIZER]),
  upload,
  eventController.createEvent
);
router.get(
  "/",
  authorizeRoles([ROLES.ORGANIZER, ROLES.ATTENDEE]),
  eventController.getEvents
);
router.get(
  "/my-events",
  authorizeRoles([ROLES.ORGANIZER]),
  verifyRoleInDB([ROLES.ORGANIZER]),
  eventController.getMyEvents
);
router.get(
  "/upcoming",
  authorizeRoles([ROLES.ORGANIZER, ROLES.ATTENDEE]),
  eventController.getUpcomingEvents
);
router.get(
  "/:id",
  authorizeRoles([ROLES.ORGANIZER, ROLES.ATTENDEE]),
  eventController.eventDetails
);
router.put(
  "/:id",
  authorizeRoles([ROLES.ORGANIZER]),
  verifyRoleInDB([ROLES.ORGANIZER]),
  upload,
  uploadToCloudinary,
  eventController.updateEvent
);
router.delete(
  "/:id",
  authorizeRoles([ROLES.ORGANIZER]),
  verifyRoleInDB([ROLES.ORGANIZER]),
  eventController.deleteEvent
);

router.get(
  "/my-events/:id",
  authorizeRoles([ROLES.ORGANIZER]),
  verifyRoleInDB([ROLES.ORGANIZER]),
  eventController.getRegistrationsByEvent
);

module.exports = router;
