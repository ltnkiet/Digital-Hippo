const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendMail = asyncHandler(async ({ email, html }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_NAME,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: '"Digital Hippo" <no-replay@digitalhippo.com>',
    to: email,
    subject: "[Digital Hippo] Password Reset E-Mail",
    html: html,
  });
  return info;
});

module.exports = sendMail;
