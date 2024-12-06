const { Registration, User, Event } = require('../models');
const sequelize = require('../config/db');

const registrationController = {
  async createRegistration(req, res) {
    try {
      const registrationData = req.body;
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
      `;

      const [registrations] = await sequelize.query(query, {
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
      const query = `
        SELECT r.*, 
          u.name as user_name, u.email as user_email,
          e.name as event_name, e.date as event_date
        FROM "registrations" r
        LEFT JOIN "users" u ON r."userid" = u."id"
        LEFT JOIN "events" e ON r."eventid" = e."id"
        WHERE r."id" = $1
      `;

      const [registration] = await sequelize.query(query, {
        bind: [req.params.id],
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
      const query = `
        UPDATE "registrations"
        SET "status" = $1,
            "updated_at" = NOW()
        WHERE "id" = $2
        RETURNING "id", "userid", "eventid", "status", "registration_date", "updated_at";
      `;

      const [results] = await sequelize.query(query, {
        bind: [req.body.status, req.params.id],
        type: sequelize.QueryTypes.UPDATE,
        raw: true,
        returning: true
      });

      if (!results.length) {
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
      const query = `
        DELETE FROM "registrations"
        WHERE "id" = $1
        RETURNING "id";
      `;

      const [results] = await sequelize.query(query, {
        bind: [req.params.id],
        type: sequelize.QueryTypes.DELETE,
        raw: true,
        returning: true
      });

      if (!results.length) {
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