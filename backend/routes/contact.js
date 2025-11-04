const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
require('dotenv').config();

const dataPath = path.join(__dirname, '../data/contacts.json');

// Helper function to read contacts
function readContacts() {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Helper function to write contacts
function writeContacts(contacts) {
  fs.writeFileSync(dataPath, JSON.stringify(contacts, null, 2));
}

// Configure email transporter (optional - only if SMTP is configured)
function getEmailTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return null;
}

// Send email notification (optional)
async function sendEmailNotification(contactData) {
  const transporter = getEmailTransporter();
  if (!transporter) {
    console.log('Email not configured - skipping email notification');
    return;
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `New Contact Form Submission - CineVerse`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${contactData.name}</p>
        <p><strong>Email:</strong> ${contactData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${contactData.message}</p>
        <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
      `
    });
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

// POST save contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    const contacts = readContacts();
    const newContact = {
      id: contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1,
      name,
      email,
      message,
      createdAt: new Date().toISOString()
    };
    contacts.push(newContact);
    writeContacts(contacts);

    // Send email notification (if configured)
    await sendEmailNotification(newContact);

    res.status(201).json({ 
      message: 'Contact message saved successfully', 
      contact: newContact 
    });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all contacts (for admin)
router.get('/', (req, res) => {
  const contacts = readContacts();
  res.json(contacts);
});

module.exports = router;



