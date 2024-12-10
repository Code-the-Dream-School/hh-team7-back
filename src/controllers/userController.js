const { User } = require('../models');
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function register(req, res) {
  try {
    // await User.sync({ force: true });
    const user = await User.create(req.body);
    const token = await createJWT(user);
    res.cookie(process.env.AUTH_COOKIES_NAME, token, {
       encode: String,
       expires: new Date(
          Date.now() + process.env.AUTH_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
       ),
       httpOnly: true,
       sameSite: 'None',
       path: "/",
       secure: true,
       signed: false,
    });
    res.status(201).json({
       message: "User registered successfully",
    });
  }catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email: email } });
    if (user == null) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(404).json({ message: "Password does not match" });
      return;
    }
    const token = await createJWT(user);
    res.cookie(process.env.AUTH_COOKIES_NAME, token, {
      encode: String,
      expires: new Date(
        Date.now() + process.env.AUTH_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      sameSite: "None",
      path: "/",
      secure: true,
      signed: false,
    });
    res.status(200).json({
      message: `${user.name} successfully logged in`,
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res
      .status(500)
      .json({ message: "Error logging in user", error: error.message });
  }
}

const logout = async (req, res) => {
  try {
    res.clearCookie(process.env.AUTH_COOKIES_NAME);
    res.status(200).json({
      message: "Successfully logged out ",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error logging out", error: error.message });
  }
};

// get all users
async function getUsers(req, res) {
  try {
    const users = await User.findAll({
      where: req.query
    });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
}

// get user by id
async function getUserById(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user', error: error.message });
  }
}

// update user
async function updateUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
}

//delete user
async function deleteUser(req, res) {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
}

async function createJWT (user) {
  return new Promise((resolve, reject) => {
     jwt.sign(
        {
           id: user._id, username: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_LIFETIME },
        (err, token) => {
           if (err) {
              reject(err);
           }
           resolve(token);
        }
     );
  });
};
module.exports = { register, login, logout, getUsers, getUserById, updateUser, deleteUser };