const { Event, User, Registration } = require('../models');
const xss = require('xss');
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { Op } = require('sequelize');
const cloudinary = require('cloudinary').v2;

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return xss(input); // sanitize string input to remove potentially dangerous characters
  }
  return input;
};

const eventController = {
  async createEvent(req, res) {
    try {
      let eventData = req.body;
      eventData.name = sanitizeInput(eventData.name);
      eventData.description = sanitizeInput(eventData.description);

      if (!eventData.name || !eventData.date) {
        return res.status(400).json({ message: 'Event name and date are required.' });
      }
      // Handle image upload
      if (req.file) {
        eventData.eventBannerUrl = req.cloudinaryResult.secure_url;
      }
      eventData.organizerId = req.user.id;
      const event = await Event.create(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Error creating event', error: error.message });
    }
  },

  async getEvents(req, res) {
    try {
      const events = await Event.findAll({});
      res.status(200).json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res
        .status(500)
        .json({ message: "Error fetching events", error: error.message });
    }
  },

  async getMyEvents(req, res) {
    try {
      const events = await Event.findAll({
        where: {
          organizerId: req.user.id,
        },
      });
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
  },

  async getEventById(req, res) {
    try {
      const eventId = sanitizeInput(req.params.id);

      // validate eventId to ensure it's a valid number
      if (isNaN(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID' });
      }
      const event = await Event.findOne({
        where: {
          id: eventId,
        },
        include: [
          {
            model: Registration,
            where: {
              UserId: req.user.id, 
            },
            required: false,
          },
        ],
      });
      
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.status(200).json(event);
    } catch (error) {
      console.error('Error fetching event:', error);
      res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
  },

  async updateEvent(req, res) {
    try {
      const eventId = sanitizeInput(req.params.id);
      const updateData = req.body;
      if (updateData.name) updateData.name = sanitizeInput(updateData.name);
      if (updateData.description)
        updateData.description = sanitizeInput(updateData.description);

      // validate eventId and update data
      if (isNaN(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID' });
      }
      const event = await Event.findOne({
        where: {
          id: eventId,
          organizerId: req.user.id // ensure user owns the event
        }
      });
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      // Handle image update
      console.log("event.file",event.file)
      if (req.file) {
        // Delete old image if it exists
        if (event.eventBannerUrl) {
          const publicId = event.eventBannerUrl.split('/').pop().split('.')[0]; 
          await cloudinary.uploader.destroy(publicId);
        }
        updateData.eventBannerUrl = req.cloudinaryResult.secure_url;
      }
      await event.update(updateData);
      res.status(200).json(event);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Error updating event', error: error.message });
    }
  },

  async deleteEvent(req, res) {
    try {
      const eventId = sanitizeInput(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID' });
      }
      const event = await Event.findOne({
        where: {
          id: eventId,
          organizerId: req.user.id // Ensure user owns the event
        }
      });
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      // Delete associated image if it exists
      if (event.eventBannerUrl) {
        const publicId = event.eventBannerUrl.split('/').pop().split('.')[0]; 
        await cloudinary.uploader.destroy(publicId);
      }
      await event.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
  },

  //Events of the next 7 days, includes the registration and user information of the organizer
  async getUpcomingEvents(req, res) {
    try {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);

      const endOfNextWeek = new Date();
      endOfNextWeek.setHours(23, 59, 59, 999); 
      endOfNextWeek.setDate(endOfNextWeek.getDate() + 7);

      const events = await Event.findAll({
        where: {
          [Op.or]: [
            {
              "$Registrations.UserId$": req.user.id,
            },
            {
              organizerId: req.user.id,
            },
          ],
          date: {
            [Op.between]: [startOfToday, endOfNextWeek], 
          },
        },
        include: [
          {
            model: Registration,
            where: {
              UserId: req.user.id,
            },
            required: false, 
          },
          {
            model: User, 
            as: "organizer",
            required: false, 
          },
        ],
      });

      res.status(200).json(events);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching up coming events",
        error: error.message,
      });
    }
  },
};

module.exports = eventController;