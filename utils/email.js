const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter
const transporter = nodemailer.createTransport({
  service: "Gmail", // or your email service
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email templates
const welcomeEmail = (name) => ({
  subject: "Welcome to Our App!",
  text: `Hi ${name},\n\nThank you for registering with us!\n\nBest regards,\nThe Team`,
  html: `<h1>Welcome ${name}!</h1>
         <p>Thank you for registering with us!</p>
         <p><strong>Best regards,</strong><br>The Team</p>`,
});

const loginEmail = (name) => ({
  subject: "Successful Login",
  text: `Hi ${name},\n\nYou have successfully logged in to your account.\n\nBest regards,\nThe Team`,
  html: `<h1>Hello ${name}!</h1>
         <p>You have successfully logged in to your account.</p>
         <p><strong>Best regards,</strong><br>The Team</p>`,
});

// Send email function
const sendEmail = async (to, template) => {
  try {
    await transporter.sendMail({
      from: `"Tao-Todo App" <${process.env.EMAIL_USERNAME}>`,
      to,
      ...template,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { welcomeEmail, loginEmail, sendEmail };
