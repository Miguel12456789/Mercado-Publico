const nodemailer = require('nodemailer');

exports.sendEmail = async (req, res) => {
  const { email, nome, sobrenome } = req.body;

  // Gere um código de verificação de 5 dígitos
  const code = Math.floor(10000 + Math.random() * 90000);

  // Configure o transporter do nodemailer (ajuste para o seu serviço de email)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'testeemailsender1@gmail.com',
      pass: 'chmg sxij adrx fvin' // Troque aqui pela senha de app gerada
    }
  });

  const mailOptions = {
    from: 'testeemailsender1@gmail.com',
    to: email,
    subject: 'Código de Verificação',
    text: `Olá${nome ? ' ' + nome : ''}${sobrenome ? ' ' + sobrenome : ''},\n\nO seu código de verificação é: ${code}\n\nObrigado!`
  };

  try {
    await transporter.sendMail(mailOptions);
    if (req.session) req.session.verificationCode = code;
    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar email:", error); // <-- Aqui mostra o erro no terminal
    res.json({ success: false, message: error.message });
  }
};