import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import smtpTransport from 'nodemailer-smtp-transport';
dotenv.config();

const sendEmail = async (mailOptions) => {
  const transporter = nodemailer.createTransport(
    smtpTransport({
      host: process.env.HOST,
      service: process.env.EMAIL_PROVIDER,
      secure: false,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
      tls: { rejectUnauthorized: false },
    })
  );
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export default sendEmail;
