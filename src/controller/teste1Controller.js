const nodemailer = require('nodemailer');
const express = require('express');


const app = express();
app.use(express.json());

let codigos = {}; // memória temporária

// 1️⃣ Envia o código
const sendEmail = async (req, res) => {
  const { email, nome } = req.body;
  const codigo = Math.floor(100000 + Math.random() * 900000); // gera 6 dígitos
  codigos[email] = codigo;

  // envia por email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: "testeemailsender1@gmail.com", pass: process.env.EMAIL_APP_PASSWORD }
  });

  await transporter.sendMail({
    from: "Verificação <testeemailsender1@gmail.com>",
    to: email,
    subject: "Código de Verificação",
    text: `Olá ${nome || ""}, o seu código de verificação é: ${codigo}`
  });

  res.json({ ok: true });
};

// 2️⃣ Verifica o código
const verify_code = async (req, res) => {
  const { email, codigo } = req.body;
  if (codigos[email] && codigos[email].toString() === codigo.toString()) {
    delete codigos[email];
    return res.json({ valido: true });
  }
  res.json({ valido: false });
};

// 3️⃣ Envia os dados para o HubSpot
const sendHubSpot = async (req, res) => {
  const { email, nome } = req.body;
  const portalId = "139646329";
  const formId = "1eb1ed6d-1f1b-4c3c-aef6-44c3c31499a3";

  const response = await fetch(`https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      fields: [
        { name: "email", value: email },
        { name: "firstname", value: nome }
      ],
      context: { pageUri: "https://teusite.com", pageName: "Formulário de Download" }
    })
  });

  res.json({ sucesso: response.ok });
};

app.listen(3000, () => console.log("Servidor a correr em http://localhost:3000"));


module.exports = { sendEmail, verify_code, sendHubSpot };  
