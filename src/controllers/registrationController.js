const { Registration, Event } = require('../models');
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

      registrationData.UserId = sanitizeInput(req.user.id);
      registrationData.EventId = sanitizeInput(registrationData.EventId);
      registrationData.status = sanitizeInput(registrationData.status);

      const registration = await Registration.create(registrationData);

      res.status(201).json(registration);
    } catch (error) {
      console.error("Error creating registration:", error);
      res
        .status(500)
        .json({ message: "Error creating registration", error: error.message });
    }
  },

  async getRegistrations(req, res) {
    try {
      const registrations = await Registration.findAll({
        where: { UserId: req.user.id },
      });

      res.status(200).json(registrations);
    } catch (error) {
      console.error("Error fetching registrations:", error);
      res.status(500).json({
        message: "Error fetching registrations",
        error: error.message,
      });
    }
  },

  async getRegistrationById(req, res) {
    try {
      const registrationId = sanitizeInput(req.params.id);
      if (isNaN(registrationId)) {
        return res.status(400).json({ message: "Invalid registration ID" });
      }
      const registration = await Registration.findByPk(registrationId);

      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      res.status(200).json(registration);
    } catch (error) {
      console.error("Error fetching registration:", error);
      res
        .status(500)
        .json({ message: "Error fetching registration", error: error.message });
    }
  },

  async updateRegistration(req, res) {
    try {
      const registrationId = sanitizeInput(req.params.id);
      const registrationData = { status: "" };
      registrationData.status = req.body.status;

      if (isNaN(registrationId)) {
        return res.status(400).json({ message: "Invalid registration ID" });
      }
      registrationData.status = sanitizeInput(registrationData.status);

      if (!registrationData.status) {
        return res.status(400).json({ message: "Status is required" });
      }

      const registration = await Registration.findByPk(registrationId);

      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      await registration.update(registrationData);
      res.status(200).json(registration);
    } catch (error) {
      console.error("Error updating registration:", error);
      res
        .status(500)
        .json({ message: "Error updating registration", error: error.message });
    }
  },

  async deleteRegistration(req, res) {
    try {
      const registrationId = sanitizeInput(req.params.id);
      const registration = await Registration.findByPk(registrationId);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }
      await registration.destroy();
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting registration:", error);
      res
        .status(500)
        .json({ message: "Error deleting registration", error: error.message });
    }
  },

  async putCheckInTime(req, res) {
    try {
      const registrationId = sanitizeInput(req.params.id);

      if (isNaN(registrationId)) {
        return res.status(400).json({ message: "Invalid registration ID" });
      }

      const registration = await Registration.findByPk(registrationId);

      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }

      await registration.update({ checkInTime: new Date() });
      res.status(200).json(registration);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error putting check in time", error: error.message });
    }
  },

};

module.exports = registrationController;