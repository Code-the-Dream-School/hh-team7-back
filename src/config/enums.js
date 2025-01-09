const ROLES = {
  ORGANIZER: "organizer",
  ATTENDEE: "attendee",
  ADMIN: "admin",
};
const EVENT_STATUS = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  CANCELED: "Canceled",
  COMPLETED: "Completed",
};
const EVENT_TYPE = {
  IN_PERSON: "In-person",
  VIRTUAL: "Virtual",
  HYBRID: "Hybrid",
};
const REGISTRATION_STATUS = {
  CONFIRMED: "Confirmed",
  CANCELED: "Canceled",
};

module.exports = { ROLES, EVENT_STATUS, EVENT_TYPE, REGISTRATION_STATUS };
