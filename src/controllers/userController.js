const User = require('../models/user');

// create new user
async function createUser(req, res) {
  try {
    const { email, first_name, last_name, nickname, zipCode } = req.body;
    const user = await User.create({
      email,
      first_name,
      last_name,
      nickname,
      zipCode
    });
    res.status(201).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating user' });
  }
}

// get user by email
async function getUser(req, res) {
  try {
    const { email } = req.query;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
}

// update user
async function updateUser(req, res) {
  try {
    const { email, first_name, last_name, nickname, zipCode } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.nickname = nickname || user.nickname;
    user.zipCode = zipCode || user.zipCode;
    user.modified_date = new Date();

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
}

module.exports = { createUser, getUser, updateUser };