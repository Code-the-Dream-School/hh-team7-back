const express = require('express');
const { Op } = require('sequelize');
const { User, Event, Registration } = require('../models'); 
const { EVENT_STATUS, REGISTRATION_STATUS } = require("../config/enums");

const router = express.Router();

router.get('/statistics', async (req, res) => {
  try {
    //Number of Events
    const totalEvents = await Event.count();

    //Confirmed Events
    const totalConfirmedEvents = await Event.count({
      where: {
        status: EVENT_STATUS.PUBLISHED, 
      },
    });

    //Cancelled Events
    const totalCancelledEvents = await Event.count({
      where: {
        status: EVENT_STATUS.CANCELED, 
      },
    });

    //Number of Attendees
    const totalAttendees = await Registration.count({
      where: {
        status: REGISTRATION_STATUS.CONFIRMED, 
      },
    });

    //Number of Users
    const totalUsers = await User.count();

    //Number of Check-Ins 
    const totalCheckIns = await Registration.count({
      where: {
        checkInTime: {
          [Op.ne]: null, // check-in time is not null
        },
      },
    });

    //Number of Upcoming Events
    const totalUpcomingEvents = await Event.count({
      where: {
        date: {
          [Op.gt]: new Date(), // Events that are in the future
        },
      },
    });

    //Number of Past Events
    const totalPastEvents = await Event.count({
      where: {
        date: {
          [Op.lt]: new Date(), // Events that have already passed
        },
      },
    });

    res.json({
      totalEvents,
      totalConfirmedEvents,
      totalCancelledEvents,
      totalAttendees,
      totalUsers,
      totalCheckIns,
      totalUpcomingEvents,
      totalPastEvents,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;
