import User from '../models/user.js';
import Project from '../models/project.js';
import EmailSecret from '../models/emailSecret.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose';
import transporter from '../utils/sendEmail.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email })
    .populate('projectsCreated')
    .populate('projectsJoined');
  if (user && (await user.matchPassword(password))) {
    res.json({
      ...user._doc,
      password: undefined,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user & get token
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  try {
    const emailSecretCode = new mongoose.Types.ObjectId();
    await User.create({
      username,
      email,
      password,
      emailCode: emailSecretCode,
    });
    await EmailSecret.create({
      email,
      code: emailSecretCode,
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Welcome to Project Manager, confirm your email to get started!',
      text: 'Welcome to the Project Manager!',
      html: `<h1>Thank you for registering!</h1></br><p>To finish registration just click this link</p><span><a href='${process.env.URL}/confirm/${emailSecretCode}'> ${process.env.URL}/confirm/${emailSecretCode}</a></span>`,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.status(200).json({
      message:
        'Confirmation email has been send to you. You can now sign in with your newly created account',
    });
  } catch (err) {
    console.log(err);
    res.status(500);
    throw new Error('Registering failed');
  }
});

// @desc    Confrim Email
// @route   POST /api/users/email
// @access  Public
const confirmEmail = asyncHandler(async (req, res) => {
  const { emailCode } = req.body;
  if (!emailCode.match(/^[0-9a-fA-F]{24}$/)) {
    throw new Error(
      "Your link is broken, make sure that it's entered correctly"
    );
  }
  const user = await User.findOne({ emailCode });
  const emailSecret = await EmailSecret.findOne({ code: emailCode });
  if (user && user.emailConfirmed) {
    res.status(200).json({ message: 'Email Confirmed!' });
  } else if (emailSecret && user) {
    user.emailConfirmed = true;
    await user.save();
    res.status(200).json({ message: 'Email Confirmed!' });
  } else if (user && !user.emailConfirmed && !emailSecret) {
    res.status(410);
    throw new Error(
      'Looks like your link is expired, click the button below in order to get new one'
    );
  } else if (!user && !emailSecret) {
    throw new Error(
      "Your link is broken, make sure that it's entered correctly"
    );
  }
});

// @desc    Resend email confirmation
// @route   POST /api/users/resend
// @access  Public
const resendEmail = asyncHandler(async (req, res) => {
  const { emailCode } = req.body;
  const newSecretCode = new mongoose.Types.ObjectId();
  const user = await User.findOneAndUpdate(
    { emailCode },
    { emailCode: newSecretCode }
  );
  if (user) {
    await EmailSecret.create({
      email: user.email,
      code: newSecretCode,
    });
    try {
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject:
          'Welcome to Project Manager, confirm your email to get started!',
        text: 'Welcome to the Project Manager!',
        html: `<h1>Thank you for registering!</h1></br><p>To finish registration just click this link</p><span><a href='${process.env.URL}/confirm/${newSecretCode}'> ${process.env.URL}/confirm/${newSecretCode}</a></span>`,
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } catch (err) {
      console.log(err);
      throw new Error('Sending email failed');
    }
    res.status(200).json({
      message:
        'Confirmation email has been send to your email. It may take up to a few minutes',
    });
  } else {
    res.status(400);
    throw new Error('Invalid code');
  }
});

// @desc    Get User Data
// @route   GET /api/user/
// @access  Private
const getUserData = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id })
    .select('-password')
    .populate('projectsCreated')
    .populate('projectsJoined');
  res.status(200).json({ ...user._doc, token: generateToken(user._id) });
});

// @desc    Get users by name or email
// @route   POST /api/users/find
// @access  Private
const findUsers = asyncHandler(async (req, res) => {
  const { isEmail, userData } = req.body;
  const { projectId } = req.params;
  let users;
  if (isEmail) {
    users = await User.find({ email: userData }).select('-password').limit(8);
  } else
    users = await User.find({ username: { $regex: userData, $options: 'i' } })
      .select('-password')
      .limit(8);

  const project = await Project.findById(projectId);
  if (users.length > 0) {
    users = users.map((user) => {
      project.users.forEach((x) => {
        if (x.user.equals(user._id)) {
          user._doc.joinedStatus = x.permissions > 0 ? '(joined)' : '(invited)';
        }
      });
      return user;
    });
    res.status(200).json(users);
  } else {
    res.status(404);
    throw new Error(
      isEmail
        ? 'No users were found under given email'
        : 'No users were found, try using email address'
    );
  }
});

export {
  authUser,
  registerUser,
  confirmEmail,
  resendEmail,
  getUserData,
  findUsers,
};
