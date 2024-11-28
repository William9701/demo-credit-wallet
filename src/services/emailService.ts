import nodemailer from "nodemailer";
import * as EmailValidator from "email-validator";
import dotenv from "dotenv";

dotenv.config();

export const sendVerificationEmail = async (email: string, verificationToken: string): Promise<boolean> => {
  if (!EmailValidator.validate(email)) {
    console.error("Invalid email format");
    return false;
  } else {
    return true;
  }

//   try {
//     const transporter = nodemailer.createTransport({
//       host: "smtp.gmail.com",
//       port: 587,
//       secure: false,
//       auth: {
//         user: '',
//         pass: '',
//       },
//     });

//     const verificationUrl = `http://localhost:3000/verify-email?token=${verificationToken}`;

//     const mailOptions = {
//       from: "Your Company <no-reply@example.com>",
//       to: email,
//       subject: "Email Verification",
//       html: `<p>Please click the link below to verify your email:</p><a href="${verificationUrl}">Verify Email</a>`,
//     };

//     await transporter.sendMail(mailOptions);
//     return true;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return false;
//   }
};
