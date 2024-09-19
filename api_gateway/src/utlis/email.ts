import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';

// Crear un transportador para el correo
const transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587,
    secure: false, 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
    tls: {
      rejectUnauthorized: false, // Para evitar errores con certificados autofirmados
    },
  });

// Definir la función para enviar el correo de restablecimiento de contraseña
export const sendResetPasswordEmail = async (to: string, token: string): Promise<void> => {
    // Construir la URL de restablecimiento
    const resetUrl: string = `${process.env.FRONTEND_URL}/reset-password?token=${token}`

    // Definir las opciones del correo
    const mailOptions: SendMailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Solicitud de Restablecimiento de Contraseña hiveSync',
        html: `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        color: #333;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #0056b3;
                        font-size: 24px;
                    }
                    p {
                        line-height: 1.6;
                        margin: 0 0 10px;
                    }
                    a {
                        color: #007bff;
                        text-decoration: none;
                        font-weight: bold;
                    }
                    a:hover {
                        text-decoration: underline;
                    }
                    .footer {
                        font-size: 12px;
                        color: #888;
                        margin-top: 20px;
                    }
                </style>
          A  </head>
            <body>
                <div class="container">
                    <h1>Solicitud de Restablecimiento de Contraseña</h1>
                    <p>Hemos recibido una solicitud de restablecimiento de contraseña para tu cuenta.</p>
                    <p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
                    <p><a href="${resetUrl}">Restablecer Contraseña</a></p>
                    <p>Si no solicitaste este cambio, por favor ignora este correo electrónico.</p>
                    <div class="footer">
                        <p>&copy; ${new Date().getFullYear()} hiveSync. Todos los derechos reservados.</p>
                    </div>
                </div>
            </body>
            </html>
        `,
    };

    try {
        // Enviar el correo
        await transporter.sendMail(mailOptions);
    } catch (error) {
        // Manejo de errores
        console.error('Error al enviar el correo:', error);
        throw new Error('Error al enviar el correo electrónico');
    }
};