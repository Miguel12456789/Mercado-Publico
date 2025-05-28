// mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: "testeemailsender1@gmail.com",
    pass: "testeemail1",
  },
});

async function sendEmail() {
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch" <testeemailsender1@gmail.com>',
    to: "tiago.martins2022153@my.istec.pt, baz@example.com",
    subject: "Hello ✔",
    text: "Hello world?",
    html: "<b>Hello world?</b>",
  });

  console.log("Message sent:", info.messageId);
}

module.exports = sendEmail;
