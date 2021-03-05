import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import smtpTransport from 'nodemailer-smtp-transport';
dotenv.config();

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  })
);
export default transporter;
