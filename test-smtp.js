// test-smtp.js
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

require("dotenv").config({ debug: true });
const nodemailer = require("nodemailer");

const testConnection = async () => {
  console.log("=== Debugging Email Configuration ===");
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASSWORD length:", process.env.EMAIL_PASSWORD?.length);
  console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD); // Show full password for debugging
  console.log("Has spaces?", process.env.EMAIL_PASSWORD?.includes(" "));
  console.log("Has newlines?", process.env.EMAIL_PASSWORD?.includes("\n"));
  console.log("Has tabs?", process.env.EMAIL_PASSWORD?.includes("\t"));
  console.log("=====================================\n");

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    await transporter.verify();
    console.log("✅ SMTP connection successful!");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "This works!",
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
};

testConnection();
