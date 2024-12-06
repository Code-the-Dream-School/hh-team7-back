const { Event, User } = require('../models');

const eventController = {
  async createEvent(req, res) {
    try {
      const eventData = req.body;
      const event = await Event.create(eventData);
      res.status(201).json(event);
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Error creating event', error: error.message });
    }
  },

  async getEvents(req, res) {
    try {
      const events = await Event.findAll({
        // where: req.query,
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
      const event = await Event.findByPk(req.params.id, {
        // include: [{
        //   model: User,
        //   as: 'organizer',
        //   attributes: ['id', 'name', 'email']
        // }]
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
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      await event.update(req.body);
      res.status(200).json(event);
    } catch (error) {
      console.error('Error updating event:', error);
      res.status(500).json({ message: 'Error updating event', error: error.message });
    }
  },

  async deleteEvent(req, res) {
    try {
      const event = await Event.findByPk(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
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