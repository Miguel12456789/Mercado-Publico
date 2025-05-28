const nodemailer = require('nodemailer');

exports.sendEmail = async (req, res) => {
  const { email, nome } = req.body;

  // Gere um código de verificação de 5 dígitos
  const code = Math.floor(10000 + Math.random() * 90000);

  // Configure o transporter do nodemailer (ajuste para o seu serviço de email)
  const transporter = nodemailer.createTransport({
    service: 'gmail', // ou outro serviço SMTP
    auth: {
      user: 'testeemailsender1@gmail.com',
      pass: 'testeemail1' // Use variáveis de ambiente para segurança
    }
  });

  const mailOptions = {
    from: 'testeemailsender1@gmail.com',
    to: email,
    subject: 'Código de Verificação',
    text: `Olá${nome ? ' ' + nome : ''},\n\nO seu código de verificação é: ${code}\n\nObrigado!`
  };

  try {
    await transporter.sendMail(mailOptions);
    // Salve o código na sessão para posterior verificação
    if (req.session) req.session.verificationCode = code;
    res.json({ success: true });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};