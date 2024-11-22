const { Registration, User, Event } = require('../models');

const registrationController = {
  async createRegistration(req, res) {
    try {
      const registrationData = req.body;
      const registration = await Registration.create(registrationData);
      res.status(201).json(registration);
    } catch (error) {
      console.error('Error creating registration:', error);
      res.status(500).json({ message: 'Error creating registration', error: error.message });
    }
  },

  async getRegistrations(req, res) {
    try {
      const registrations = await Registration.findAll({
        // where: req.query,
        // include: [
        //   {
        //     model: User,
        //     attributes: ['id', 'name', 'email']
        //   },
        //   {
        //     model: Event,
        //     attributes: ['id', 'name', 'date']
        //   }
        // ]
      });
      res.status(200).json(registrations);
    } catch (error) {
      console.error('Error fetching registrations:', error);
      res.status(500).json({ message: 'Error fetching registrations', error: error.message });
    }
  },

  async getRegistrationById(req, res) {
    try {
      const registration = await Registration.findByPk(req.params.id, {
        include: [
          {
            model: User,
            attributes: ['id', 'name', 'email']
          },
          {
            model: Event,
            attributes: ['id', 'name', 'date']
          }
        ]
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
      const registration = await Registration.findByPk(req.params.id);
      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }
      await registration.update(req.body);
      res.status(200).json(registration);
    } catch (error) {
      console.error('Error updating registration:', error);
      res.status(500).json({ message: 'Error updating registration', error: error.message });
    }
  },

  async deleteRegistration(req, res) {
    try {
      const registration = await Registration.findByPk(req.params.id);
      if (!registration) {
        return res.status(404).json({ message: 'Registration not found' });
      }
      await registration.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting registration:', error);
      res.status(500).json({ message: 'Error deleting registration', error: error.message });
    }
  }
};

module.exports = registrationController;