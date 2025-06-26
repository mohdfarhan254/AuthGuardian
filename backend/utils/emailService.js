const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Optional: verify transporter on startup (debugging purpose)
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email transporter error:', error);
  } else {
    console.log('✅ Email transporter is ready to send emails');
  }
});

const sendMail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"AuthGuardian" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`📨 Email sent to: ${to}`);
  } catch (error) {
    console.error(`❌ Email send failed to ${to}:`, error.message);
    throw new Error('Failed to send email'); // Let controller handle response
  }
};

module.exports = sendMail;
