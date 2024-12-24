const { Event } = require('../models');
const xss = require('xss');
const { StatusCodes } = require("http-status-codes");

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return xss(input); // sanitize string input to remove potentially dangerous characters
  }
  return input;
};

const publicEventController = {
  
  async getAllEvents(req, res) {
    try {
      const events = await Event.findAll({});
      res.status(StatusCodes.OK).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching events', error: error.message });
    }
  },

  async getEventById(req, res) {
    try {
      const eventId = sanitizeInput(req.params.id);

      // validate eventId to ensure it's a valid number
      if (isNaN(eventId)) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid event ID' });
      }
      const event = await Event.findOne({
        where: { 
          id: eventId
        }
      });
      if (!event) {
        return res.status(StatusCodes.NOT_FOUND).json({ message: 'Event not found' });
      }
      res.status(StatusCodes.OK).json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Error fetching event', error: error.message });
    }
  }
};

module.exports = publicEventController;