const { Event, User } = require('../models');
const xss = require('xss');
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const path = require('path');
const fs = require('fs').promises;

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
        eventData.event_banner_url = `/uploads/${req.file.filename}`;
      }
      eventData.organizerid = req.user.id; 
      const event = await Event.create(eventData);
      res.status(201).json(event);
    } catch (error) {
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Error creating event', error: error.message });
    }
  },

  async getEvents(req, res) {
    try {
      console.log(req.user)
      const events = await Event.findAll({
        where: {
          organizerid: req.user.id // filter by authenticated user
        }
        // include: [{
        //   model: User,
        //   as: 'organizer',
        //   attributes: ['id', 'name', 'email']
        // }]
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
          organizerid: req.user.id // ensure user owns the event
        }
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
      if (updateData.description) updateData.description = sanitizeInput(updateData.description);

      // validate eventId and update data
      if (isNaN(eventId)) {
        return res.status(400).json({ message: 'Invalid event ID' });
      }
      const event = await Event.findOne({
        where: { 
          id: eventId,
          organizerid: req.user.id // ensure user owns the event
        }
      });
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      // Handle image update
      if (req.file) {
        // Delete old image if it exists
        if (event.event_banner_url) {
          const oldImagePath = path.join(__dirname, '../../public', event.event_banner_url);
          await fs.unlink(oldImagePath).catch(console.error);
        }
        updateData.event_banner_url = `/uploads/${req.file.filename}`;
      }
      await event.update(updateData);
      res.status(200).json(event);
    } catch (error) {
      // Clean up uploaded file if update fails
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }
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
          organizerid: req.user.id // Ensure user owns the event
        }
      });
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      // Delete associated image if it exists
      if (event.event_banner_url) {
        const imagePath = path.join(__dirname, '../../public', event.event_banner_url);
        await fs.unlink(imagePath).catch(console.error);
      }
      await event.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
  }
};

module.exports = eventController;