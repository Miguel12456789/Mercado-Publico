const nodemailer = require('nodemailer');

const sendEmail = async (req, res) => {
  const { email, nome, sobrenome } = req.body;

  if (!email || !email.trim()) {
    return res.json({ success: false, message: 'O campo de email é obrigatório.' });
  }

  // Gere um código de verificação de 5 dígitos
  const code = Math.floor(10000 + Math.random() * 90000);

  // Configure o transporter do nodemailer (ajuste para o seu serviço de email)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'testeemailsender1@gmail.com',
      pass: process.env.EMAIL_APP_PASSWORD
    }

  });

  const mailOptions = {
    from: 'testeemailsender1@gmail.com',
    to: email,
    subject: 'Código de Verificação - Sua Conta',
    html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Código de Verificação</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; line-height: 1.6;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 40px 20px;">
                        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                            <!-- Header -->
                            <tr>
                                <td style="background-color: #3c6c2a; padding: 40px 30px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">Verificação de Segurança</h1>
                                </td>
                            </tr>
                            
                            <!-- Content -->
                            <tr>
                                <td style="padding: 40px 30px;">
                                    <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                                        Olá${nome ? ' ' + nome : ''}${sobrenome ? ' ' + sobrenome : ''},
                                    </h2>
                                    
                                    <p style="color: #6b7280; margin: 0 0 30px 0; font-size: 16px;">
                                        Para garantir a segurança da sua conta, precisamos verificar sua identidade. 
                                        Use o código abaixo para concluir o processo de verificação:
                                    </p>
                                    
                                    <!-- Verification Code -->
                                    <div style="background-color: #f9fafb; border: 2px dashed #d1d5db; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
                                        <p style="color: #6b7280; margin: 0 0 15px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">
                                            Código de Verificação
                                        </p>
                                        <div style="font-size: 42px; font-weight: 700; color: #3c6c2a; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${code}
                                        </div>
                                    </div>
                                    
                                    <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 30px 0; border-radius: 4px;">
                                        <p style="color: #92400e; margin: 0; font-size: 14px;">
                                            <strong>Importante:</strong> Se você não solicitou este código, ignore este email. 
                                            Nunca compartilhe este código com terceiros.
                                        </p>
                                    </div>
                                    
                                    <p style="color: #6b7280; margin: 30px 0 0 0; font-size: 14px;">
                                        Se você tiver alguma dúvida ou precisar de ajuda, entre em contato conosco.
                                    </p>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #9ca3af; margin: 0; font-size: 12px;">
                                        © 2025 Helpdesk Público. Todos os direitos reservados.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        `
  };



  try {
    await transporter.sendMail(mailOptions);

    const adminNotificationOptions = {
      from: 'testeemailsender1@gmail.com',
      to: 'miguel.martins.2022154@my.istec.pt',
      subject: 'Novo Pedido de Verificação de Conta',
      html: `
    <p>O seguinte utilizador solicitou um código de verificação:</p>
    <ul>
      <li><strong>Email:</strong> ${email}</li>
      ${nome ? `<li><strong>Nome:</strong> ${nome}</li>` : ''}
      ${sobrenome ? `<li><strong>Sobrenome:</strong> ${sobrenome}</li>` : ''}
      <li><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-PT')}</li>
    </ul>
  `
    };

    await transporter.sendMail(adminNotificationOptions);


    if (req.session) req.session.verificationCode = code;
    res.json({ success: true });
  } catch (error) {
    console.error("Erro ao enviar email:", error); // <-- Aqui mostra o erro no terminal
    res.json({ success: false, message: error.message });
  }
};


const verify_code = async (req, res) => {
  const { code } = req.body;
  if (req.session && req.session.verificationCode == code) {
    return res.json({ success: true });
  }

  return res.json({ success: false, message: 'Código incorreto. Tente novamente.' });
};


module.exports = { sendEmail, verify_code };  