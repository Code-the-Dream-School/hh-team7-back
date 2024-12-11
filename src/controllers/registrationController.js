const { Registration, User, Event } = require('../models');
const sequelize = require('../config/db');
const xss = require('xss');

//sanitize inputs
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return xss(input); // sanitize string input to remove dangerous characters
  }
  return input;
};

const registrationController = {
  async createRegistration(req, res) {
    try {
      const registrationData = req.body;

      // sanitize data from input
      registrationData.userid = sanitizeInput(registrationData.userid);
      registrationData.eventid = sanitizeInput(registrationData.eventid);
      registrationData.status = sanitizeInput(registrationData.status);

      const query = `
        INSERT INTO "registrations" ("userid", "eventid", "status", "registration_date")
        VALUES ($1, $2, $3, NOW()) 
        RETURNING "id", "userid", "eventid", "registration_date", "status";
      `;

      const [results] = await sequelize.query(query, {
        bind: [registrationData.userid, registrationData.eventid, registrationData.status],
        type: sequelize.QueryTypes.INSERT,
        raw: true,
        returning: true
      });

      res.status(201).json(results[0]);
    } catch (error) {
      console.error('Error creating registration:', error);
      res.status(500).json({ message: 'Error creating registration', error: error.message });
    }
  },

  async getRegistrations(req, res) {
    try {
      const query = `
        SELECT r.*, 
          u.name as user_name, u.email as user_email,
          e.name as event_name, e.date as event_date
        FROM "registrations" r
        LEFT JOIN "users" u ON r."userid" = u."id"
        LEFT JOIN "events" e ON r."eventid" = e."id"
        WHERE r."userid" = $1
      `;

      const [registrations] = await sequelize.query(query, {
        bind: [req.user.id],
        type: sequelize.QueryTypes.SELECT,
        raw: true
      });

      res.status(200).json(registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({ message: 'Error fetching registrations', error: error.message });
    }
  },

  async getRegistrationById(req, res) {
    try {
      const registrationId = sanitizeInput(req.params.id); // sanitize id

      // ensure registrationId it`s a valid number
      if (isNaN(registrationId)) {
        return res.status(400).json({ message: 'Invalid registration ID' });
      }
      const query = `
        SELECT r.*, 
          u.name as user_name, u.email as user_email,
          e.name as event_name, e.date as event_date
        FROM "registrations" r
        LEFT JOIN "users" u ON r."userid" = u."id"
        LEFT JOIN "events" e ON r."eventid" = e."id"
        WHERE r."id" = $1 AND r."userid" = $2
      `;

      const [registration] = await sequelize.query(query, {
        bind: [req.params.id, req.user.id],
        type: sequelize.QueryTypes.SELECT,
        raw: true
      });

      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      res.status(200).json(registration);
    } catch (error) {
      console.error('Error fetching registration:', error);
      res.status(500).json({ message: 'Error fetching registration', error: error.message });
    }
  },

  async updateRegistration(req, res) {
    try {
      const registrationId = sanitizeInput(req.params.id); // sanitize registration id
      const status = sanitizeInput(req.body.status); // sanitize the status 

      // validate registrationId and status
      if (isNaN(registrationId) || !status) {
        return res.status(400).json({ message: 'Invalid registration ID or status' });
      }
      const query = `
        UPDATE "registrations"
        SET "status" = $1        
        WHERE "id" = $2 AND "userid" = $3
        RETURNING "id", "userid", "eventid", "status", "registration_date";
      `;

      const [results] = await sequelize.query(query, {
        bind: [req.body.status, req.params.id, req.user.id],
        type: sequelize.QueryTypes.UPDATE,
        raw: true,
        returning: true
      });

      if (!results.length || !results) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      res.status(200).json(results[0]);
    } catch (error) {
      console.error('Error updating registration:', error);
      res.status(500).json({ message: 'Error updating registration', error: error.message });
    }
  },

  async deleteRegistration(req, res) {
    try {
      const registrationId = sanitizeInput(req.params.id); // sanitize id

      // validate registrationId to ensure it's a valid number
      if (isNaN(registrationId)) {
        return res.status(400).json({ message: 'Invalid registration ID' });
      }

      const query = `
        DELETE FROM "registrations"
        WHERE "id" = $1 AND "userid" = $2
        RETURNING "id";
      `;

      const [results] = await sequelize.query(query, {
        bind: [req.params.id, req.user.id],
        type: sequelize.QueryTypes.DELETE,
        raw: true,
        returning: true
      });
      console.log(results);
      if (!results || !results.id) {
        return res.status(404).json({ message: 'Registration not found' });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting registration:', error);
      res.status(500).json({ message: 'Error deleting registration', error: error.message });
    }
  }
};

module.exports = registrationController;