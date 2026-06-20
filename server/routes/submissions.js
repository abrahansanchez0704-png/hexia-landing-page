import { Router } from 'express';
import { getDb } from '../db.js';
import { sendNotification } from '../email.js';

const router = Router();

async function upsertClient(db, name, email, countryCode, phone, company, role, industry) {
  const existing = await db.get('SELECT id FROM clients WHERE email = ?', email);
  if (existing) {
    await db.run("UPDATE clients SET name=?, phone=?, country_code=?, company=?, role=?, industry=?, updated_at=datetime('now') WHERE id=?",
      name, phone||'', countryCode||'', company||'', role||'', industry||'', existing.id);
    return existing.id;
  }
  const r = await db.run('INSERT INTO clients (name, email, phone, country_code, company, role, industry, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    name, email, phone||'', countryCode||'', company||'', role||'', industry||'', 'project');
  return r.lastInsertRowid;
}

router.post('/newsletter', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.trim()) {
    return res.status(400).json({ error: 'Email es requerido' });
  }
  const db = await getDb();
  const result = await db.run('INSERT INTO newsletter_submissions (email) VALUES (?)', email.trim());
  sendNotification('newsletter', { email: email.trim() });
  res.json({ success: true, id: result.lastInsertRowid });
});

router.post('/projects', async (req, res) => {
  const { name, email, countryCode, phone, company, role, industry, projectType, projectDetails, documents, nda, budget } = req.body;
  if (!name || !name.trim() || !email || !email.trim()) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }
  const db = await getDb();
  const result = await db.run(
    `INSERT INTO project_submissions (name, email, country_code, phone, company, role, industry, project_type, project_details, documents, nda, budget)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    name.trim(), email.trim(), countryCode || '', phone || '',
    company || '', role || '', industry || '', projectType || '',
    projectDetails || '', JSON.stringify(documents || []), nda ? 1 : 0, budget || ''
  );
  await upsertClient(db, name.trim(), email.trim(), countryCode, phone, company, role, industry);
  sendNotification('project', req.body);
  res.json({ success: true, id: result.lastInsertRowid });
});

router.post('/tickets', async (req, res) => {
  const db = await getDb();
  const { client_name, client_email, client_phone, company, subject, description, priority } = req.body;
  if (!client_name || !client_email || !subject || !description) {
    return res.status(400).json({ error: 'Nombre, email, asunto y descripción requeridos' });
  }
  const result = await db.run(
    'INSERT INTO support_tickets (client_name, client_email, client_phone, company, subject, description, priority) VALUES (?, ?, ?, ?, ?, ?, ?)',
    client_name, client_email, client_phone||'', company||'', subject, description, priority||'normal'
  );
  sendNotification('ticket', { client_name, client_email, subject, description });
  res.json({ success: true, id: result.lastInsertRowid });
});

export default router;
