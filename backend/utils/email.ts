import nodemailer from "nodemailer";

const sendEmail = async (to: string, subject: string, body: string) => {
  // Création du transporteur SMTP pour MailHog
  const transporter = nodemailer.createTransport({
    host: "mailhog", // Nom du service dans Docker
    port: 1025, // Port SMTP de MailHog
  });

  // Options de l'email
  const mailOptions = {
    from: "My company <localhost@mailhog.local>",
    to,
    subject,
    text: body,
  };

  // Envoi de l'email
  try {
    const info = await transporter.sendMail(mailOptions);
    return info; // Retourne l'info de l'email envoyé
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Échec de l'envoi de l'email");
  }
};

export default sendEmail;
