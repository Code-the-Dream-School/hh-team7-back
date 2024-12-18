const { User } = require('../models');
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const xss = require("xss");
const sgMail = require('@sendgrid/mail')

// Function to sanitize and escape user input
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return validator.escape(xss(input)); // Escape and sanitize input
  }
  return input;
};

// Helper function to validate email format
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Helper function to validate password format
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

async function register(req, res) {
  try {
    let { name, email, password, role } = req.body;
    name = sanitizeInput(name);
    email = sanitizeInput(email);
    password = sanitizeInput(password);
    role = sanitizeInput(role);

    // validate email and password
    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long, include a number and a special character.",
      });
    }

    // check if user already exists
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already taken" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    // await User.sync({ force: true });
    const token = await createJWT(user, process.env.JWT_SESION_LIFETIME);
    const expiresInDays = parseInt(process.env.AUTH_COOKIE_EXPIRES, 10);
    // res.cookie(process.env.AUTH_COOKIES_NAME, token, {
    //    encode: String,
    //    expires: new Date(
    //       Date.now() + expiresInDays * 24 * 60 * 60 * 1000
    //    ),
    //    httpOnly: true,
    //    sameSite: 'None',
    //    path: "/",
    //    secure: true,
    //    signed: false,
    // });
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(201).json({
       message: "User registered successfully",
       user: { name: user.name },
       token
    });
  }catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    // sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    // validate email and password
    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(sanitizedPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long, include a number and a special character.",
      });
    }
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
    const token = await createJWT(user, process.env.JWT_SESION_LIFETIME);
    // res.cookie(process.env.AUTH_COOKIES_NAME, token, {
    //   encode: String,
    //   expires: new Date(
    //     Date.now() + process.env.AUTH_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    //   ),
    //   httpOnly: true,
    //   sameSite: "None",
    //   path: "/",
    //   secure: true,
    //   signed: false,
    // });
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(200).json({
      message: `${user.name} successfully logged in`,
      user: { name: user.name },
      token
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
    // res.clearCookie(process.env.AUTH_COOKIES_NAME);
    res.setHeader('Authorization', '');
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
    const sanitizedData = {
      name: sanitizeInput(req.body.name),
      email: sanitizeInput(req.body.email),
      role: sanitizeInput(req.body.role),
    };
    await user.update(sanitizedData);
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

async function createJWT (user, expirationTime) {
  return new Promise((resolve, reject) => {
     jwt.sign(
        {
           id: user.id, username: user.name
        },
        process.env.JWT_SECRET,
        { expiresIn: expirationTime },
        (err, token) => {
           if (err) {
              reject(err);
           }
           resolve(token);
        }
     );
  });
};

async function passwordResetRequest(req, res) {
  const { email } = req.body;
  try {
    const sanitizedEmail = sanitizeInput(email);

    if (!validateEmail(sanitizedEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ where: { email: sanitizedEmail } });

    if (user) {
      const token = await createJWT(
        user,
        process.env.JWT_PASSWORD_RESET_LIFETIME
      );

      const URL =
        process.env.FORGOT_PASSWORD_URL_CLIENT +
        `?${process.env.FORGOT_PASSWORD_URL_TOKEN_PARAMETER_NAME}=${token}`;

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: user.email,
        from: process.env.SENDGRID_SENDER,
        subject: "Reset Password",
        text: `Click here for reset your password ${URL}`,
        html: `<strong>Click here for reset your password ${URL}</strong>`,
      };
      await sgMail.send(msg);
    }

    res.status(200).json({
      message: `Email sent to ${email}`,
    });
  } catch (error) {}
}

async function passwordResetVerify(req, res, next) {
  try {
    const {
      query: {
        [process.env.FORGOT_PASSWORD_URL_TOKEN_PARAMETER_NAME]: resetToken,
      },
    } = req;

    if (!resetToken) {
      return res.status(400).json({ message: "Missing password reset token" });
    }
    jwt.verify(resetToken, process.env.JWT_SECRET);

    res.status(200).json({ message: "Token successfully validated" });
  } catch (error) {
    next(error);
  }
}

async function passwordResetUpdate(req, res, next) {
  try {
    const { password } = req.body;
    const {
      query: {
        [process.env.FORGOT_PASSWORD_URL_TOKEN_PARAMETER_NAME]: resetToken,
      },
    } = req;

    if (!resetToken) {
      return res.status(400).json({ message: "Missing password reset token" });
    }

    const resetPayload = jwt.verify(resetToken, process.env.JWT_SECRET);
    const sanitizedPassword = sanitizeInput(password);
    
    if (!validatePassword(sanitizedPassword)) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long, include a number and a special character",
      });
    }

    const user = await User.findByPk(resetPayload.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const salt = await bcrypt.genSalt();
    const newHashPassword = await bcrypt.hash(sanitizedPassword, salt);

    await user.update({ password: newHashPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, passwordResetRequest, passwordResetVerify, passwordResetUpdate, getUsers, getUserById, updateUser, deleteUser };