import nodemailer from 'nodemailer';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  return transporter;
}

export async function sendEmail(to, subject, html) {
  const t = getTransporter();
  if (!t) return false;
  try {
    await t.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });
    return true;
  } catch (err) {
    console.error('Email send failed:', err.message);
    return false;
  }
}

export async function sendNotification(type, data) {
  const to = process.env.NOTIFICATION_EMAIL;
  if (!to) return;

  let subject, html;
  if (type === 'newsletter') {
    subject = 'Nuevo suscriptor - HEXIA Newsletter';
    html = `<h2>Nuevo suscriptor</h2><p><strong>Email:</strong> ${data.email}</p><p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>`;
  } else if (type === 'project') {
    subject = `Nuevo proyecto - ${data.name}`;
    html = `
      <h2>Nuevo proyecto recibido</h2>
      <table border="1" cellpadding="8" cellspacing="0" style="border-collapse:collapse">
        <tr><td><strong>Nombre</strong></td><td>${data.name}</td></tr>
        <tr><td><strong>Email</strong></td><td>${data.email}</td></tr>
        <tr><td><strong>Teléfono</strong></td><td>${data.countryCode} ${data.phone}</td></tr>
        <tr><td><strong>Empresa</strong></td><td>${data.company || '-'}</td></tr>
        <tr><td><strong>Cargo</strong></td><td>${data.role || '-'}</td></tr>
        <tr><td><strong>Industria</strong></td><td>${data.industry}</td></tr>
        <tr><td><strong>Tipo proyecto</strong></td><td>${data.projectType}</td></tr>
        <tr><td><strong>Detalles</strong></td><td>${data.projectDetails}</td></tr>
        <tr><td><strong>Documentos</strong></td><td>${(data.documents || []).join(', ') || '-'}</td></tr>
        <tr><td><strong>NDA</strong></td><td>${data.nda ? 'Sí' : 'No'}</td></tr>
        <tr><td><strong>Presupuesto</strong></td><td>${data.budget || '-'}</td></tr>
      </table>
    `;
  } else if (type === 'ticket') {
    subject = `Nuevo ticket de soporte - ${data.subject}`;
    html = `<h2>Nuevo ticket de soporte</h2><p><strong>De:</strong> ${data.client_name} (${data.client_email})</p><p><strong>Asunto:</strong> ${data.subject}</p><p><strong>Descripción:</strong> ${data.description}</p>`;
  }

  if (subject && html) {
    await sendEmail(to, subject, html);
  }
}
