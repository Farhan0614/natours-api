import nodemailer from 'nodemailer';
import { convert } from 'html-to-text';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.fromEmail = process.env.EMAIL_FROM; // must be a Brevo-verified sender
    this.fromName = 'Natours';
  }

  // Production: send via Brevo HTTP API (HTTPS 443).
  // Render's FREE tier blocks outbound SMTP ports 25/465/587, which made
  // nodemailer time out. The API goes over 443, which is never blocked.
  async sendViaBrevoApi(html, subject) {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: this.fromName, email: this.fromEmail },
        to: [{ email: this.to }],
        subject,
        htmlContent: html,
        textContent: convert(html), // plain-text fallback like before
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(
        `Brevo API error ${res.status}: ${body.message || 'email send failed'}`,
      );
    }
  }

  // Development: classic SMTP via Mailtrap (unchanged behavior)
  newDevTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async send(templateName, subject) {
    // 1) Read the HTML file from the disk
    const htmlFilePath = path.join(
      __dirname,
      `../views/email/${templateName}.html`,
    );
    let html = await fs.readFile(htmlFilePath, 'utf-8');

    // 2) Replace the placeholders with the actual dynamic data
    html = html.replace(/{{FIRST_NAME}}/g, this.firstName);
    html = html.replace(/{{URL}}/g, this.url);

    // 3) Route: production → Brevo API, development → SMTP
    if (process.env.NODE_ENV === 'production') {
      return this.sendViaBrevoApi(html, subject);
    }

    await this.newDevTransport().sendMail({
      from: `${this.fromName} <${this.fromEmail}>`,
      to: this.to,
      subject,
      html,
      text: convert(html),
    });
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 min)',
    );
  }
}

// import nodemailer from 'nodemailer';
// import { convert } from 'html-to-text';
// import fs from 'fs/promises';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Recreate __dirname for ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default class Email {
//   constructor(user, url) {
//     this.to = user.email;
//     this.firstName = user.name.split(' ')[0];
//     this.url = url;
//     this.from = `Natours <${process.env.EMAIL_FROM}>`;
//   }

//   newTransport() {
//     if (process.env.NODE_ENV === 'production') {
//       // Configuration for real emails (BREVO) goes here later

//       return nodemailer.createTransport({
//         host: process.env.BREVO_HOST,
//         port: process.env.BREVO_PORT,
//         auth: {
//           user: process.env.BREVO_USERNAME,
//           pass: process.env.BREVO_PASSWORD,
//         },
//       });
//     }

//     return nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT,
//       auth: {
//         user: process.env.EMAIL_USERNAME,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });
//   }

//   async send(templateName, subject) {
//     // 1) Read the HTML file from the disk
//     const htmlFilePath = path.join(
//       __dirname,
//       `../views/email/${templateName}.html`,
//     );
//     let html = await fs.readFile(htmlFilePath, 'utf-8');

//     // 2) Replace the placeholders with the actual dynamic data
//     // Using a global regular expression (/g) ensures all instances are replaced
//     html = html.replace(/{{FIRST_NAME}}/g, this.firstName);
//     html = html.replace(/{{URL}}/g, this.url);

//     // 3) Define email options
//     const mailOptions = {
//       from: this.from,
//       to: this.to,
//       subject,
//       html,
//       // html-to-text automatically converts the raw HTML into a clean text-only version
//       text: convert(html),
//     };

//     // 4) Create a transport and send the email
//     await this.newTransport().sendMail(mailOptions);
//   }

//   async sendWelcome() {
//     await this.send('welcome', 'Welcome to the Natours Family!');
//   }

//   async sendPasswordReset() {
//     await this.send(
//       'passwordReset',
//       'Your password reset token (valid for 10 min)',
//     );
//   }
// }

// const sendEmail = async (options) => {
//   //create a transporter
//   const transporter = nodemailer.createTransport({
//     host: process.env.EMAIL_HOST,
//     port: process.env.EMAIL_PORT,
//     auth: {
//       user: process.env.EMAIL_USERNAME,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
//   //define the email options
//   const mailOptions = {
//     from: 'Muhammad Farhan <hello@farhan.com>',
//     to: options.email,
//     subject: options.subject,
//     text: options.message,
//     //html
//   };

//   //actually send the email
//   await transporter.sendMail(mailOptions);
// };
