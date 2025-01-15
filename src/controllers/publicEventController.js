const { Event } = require('../models');
const xss = require('xss');
const { StatusCodes } = require("http-status-codes");
const { Op } = require('sequelize');

const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return xss(input); // sanitize string input to remove potentially dangerous characters
  }
  return input;
};

const publicEventController = {
  
  async getAllEvents(req, res) {
    try {
      const { page = 1, limit = 10, search = '', start_date, end_date, category, location } = req.query;

      const pageNumber = parseInt(page, 10);
      const limitNumber = parseInt(limit, 10);

      if (isNaN(pageNumber) || pageNumber < 1) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid page number' });
      }
      if (isNaN(limitNumber) || limitNumber < 1) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Invalid limit value' });
      }

      let whereConditions = {
        isPrivate: false  
      };

      if (search) {
        whereConditions[Op.or] = [
          { name: { [Op.iLike]: `%${sanitizeInput(search)}%` } },
          { description: { [Op.iLike]: `%${sanitizeInput(search)}%` } },
          { location: { [Op.iLike]: `%${sanitizeInput(search)}%` } }
        ];
      }

      if (start_date || end_date) {
        whereConditions.date = {};

        if (start_date) {
          whereConditions.date[Op.gte] = new Date(start_date); // >=
        }

        if (end_date) {
          whereConditions.date[Op.lte] = new Date(end_date); // <=
        }
      }

      if (category) {
        const categoriesArray = category.split(',').map(c => c.trim()); 
        whereConditions.category = { [Op.in]: categoriesArray };  
      }

      if (location) {
        whereConditions.location = { [Op.iLike]: `%${sanitizeInput(location)}%` };  
      }

      const events = await Event.findAndCountAll({
        where: whereConditions,
        limit: limitNumber,
        offset: (pageNumber - 1) * limitNumber,
      });

      res.status(StatusCodes.OK).json({
        total: events.count,
        page: pageNumber,
        limit: limitNumber,
        events: events.rows,
      });
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
          id: eventId,
          isPrivate: false
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