import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
}) => {
  // 1) Create a transporter
  const transporter = nodemailer.createTransport({
    // service: 'Gmail', // need to activate "less secure app" option in gmail
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  } as SMTPTransport.Options);

  // 2) Define the email options
  const mailOptions = {
    from: "Iki Jito <iki.jito@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // 3) Actually send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
