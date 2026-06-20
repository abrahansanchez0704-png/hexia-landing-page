import { Router } from 'express';
import { getDb } from '../db.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'hexia-default-secret';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'hexia2024';

import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  try {
    const token = header.split(' ')[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
}

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ success: true, token });
  }
  res.status(401).json({ error: 'Credenciales inválidas' });
});

router.get('/submissions', authMiddleware, async (req, res) => {
  const db = await getDb();
  const newsletters = await db.all('SELECT * FROM newsletter_submissions ORDER BY created_at DESC');
  const projects = await db.all('SELECT * FROM project_submissions ORDER BY created_at DESC');
  res.json({ newsletters, projects });
});

router.delete('/submissions/newsletter/:id', authMiddleware, async (req, res) => {
  const db = await getDb();
  await db.run('DELETE FROM newsletter_submissions WHERE id = ?', req.params.id);
  res.json({ success: true });
});

router.delete('/submissions/projects/:id', authMiddleware, async (req, res) => {
  const db = await getDb();
  await db.run('DELETE FROM project_submissions WHERE id = ?', req.params.id);
  res.json({ success: true });
});

router.get('/dashboard', authMiddleware, async (req, res) => {
  const db = await getDb();
  const [clientCount, ticketCount, openTickets, newsletterCount, projectCount, recentTickets, recentClients] = await Promise.all([
    db.get('SELECT COUNT(*) as c FROM clients'),
    db.get('SELECT COUNT(*) as c FROM support_tickets'),
    db.get("SELECT COUNT(*) as c FROM support_tickets WHERE status = 'open'"),
    db.get('SELECT COUNT(*) as c FROM newsletter_submissions'),
    db.get('SELECT COUNT(*) as c FROM project_submissions'),
    db.all('SELECT * FROM support_tickets ORDER BY created_at DESC LIMIT 5'),
    db.all('SELECT * FROM clients ORDER BY created_at DESC LIMIT 5'),
  ]);
  res.json({
    clients: clientCount.c,
    tickets: ticketCount.c,
    openTickets: openTickets.c,
    newsletters: newsletterCount.c,
    projects: projectCount.c,
    recentTickets,
    recentClients,
  });
});

router.get('/clients', authMiddleware, async (req, res) => {
  const db = await getDb();
  const { search, status } = req.query;
  let query = 'SELECT * FROM clients';
  const params = [];
  const where = [];
  if (search) { where.push('(name LIKE ? OR email LIKE ? OR company LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  if (status) { where.push('status = ?'); params.push(status); }
  if (where.length) query += ' WHERE ' + where.join(' AND ');
  query += ' ORDER BY created_at DESC';
  res.json(await db.all(query, ...params));
});

router.post('/clients', authMiddleware, async (req, res) => {
  const db = await getDb();
  const { name, email, phone, country_code, company, role, industry, notes, status, source } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Nombre y email requeridos' });
  const result = await db.run(
    'INSERT INTO clients (name, email, phone, country_code, company, role, industry, notes, status, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    name, email, phone || '', country_code || '', company || '', role || '', industry || '', notes || '', status || 'lead', source || 'manual'
  );
  res.json({ success: true, id: result.lastInsertRowid });
});

router.put('/clients/:id', authMiddleware, async (req, res) => {
  const db = await getDb();
  const { name, email, phone, country_code, company, role, industry, notes, status } = req.body;
  await db.run(
    "UPDATE clients SET name=?, email=?, phone=?, country_code=?, company=?, role=?, industry=?, notes=?, status=?, updated_at=datetime('now') WHERE id=?",
    name, email, phone||'', country_code||'', company||'', role||'', industry||'', notes||'', status||'lead', req.params.id
  );
  res.json({ success: true });
});

router.delete('/clients/:id', authMiddleware, async (req, res) => {
  const db = await getDb();
  await db.run('DELETE FROM clients WHERE id = ?', req.params.id);
  res.json({ success: true });
});

router.get('/tickets', authMiddleware, async (req, res) => {
  const db = await getDb();
  const { search, status, priority } = req.query;
  let query = 'SELECT * FROM support_tickets';
  const params = [];
  const where = [];
  if (search) { where.push('(client_name LIKE ? OR client_email LIKE ? OR subject LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  if (status) { where.push('status = ?'); params.push(status); }
  if (priority) { where.push('priority = ?'); params.push(priority); }
  if (where.length) query += ' WHERE ' + where.join(' AND ');
  query += ' ORDER BY created_at DESC';
  res.json(await db.all(query, ...params));
});

router.put('/tickets/:id', authMiddleware, async (req, res) => {
  const db = await getDb();
  const { status, priority, assigned_to } = req.body;
  const updates = [];
  const params = [];
  if (status) { updates.push('status = ?'); params.push(status); }
  if (priority) { updates.push('priority = ?'); params.push(priority); }
  if (assigned_to !== undefined) { updates.push('assigned_to = ?'); params.push(assigned_to); }
  if (updates.length) {
    updates.push("updated_at = datetime('now')");
    params.push(req.params.id);
    await db.run(`UPDATE support_tickets SET ${updates.join(', ')} WHERE id=?`, ...params);
  }
  res.json({ success: true });
});

router.delete('/tickets/:id', authMiddleware, async (req, res) => {
  const db = await getDb();
  await db.run('DELETE FROM ticket_replies WHERE ticket_id = ?', req.params.id);
  await db.run('DELETE FROM support_tickets WHERE id = ?', req.params.id);
  res.json({ success: true });
});

router.get('/tickets/:id', authMiddleware, async (req, res) => {
  const db = await getDb();
  const ticket = await db.get('SELECT * FROM support_tickets WHERE id = ?', req.params.id);
  if (!ticket) return res.status(404).json({ error: 'Ticket no encontrado' });
  ticket.replies = await db.all('SELECT * FROM ticket_replies WHERE ticket_id = ? ORDER BY created_at ASC', req.params.id);
  res.json(ticket);
});

router.post('/tickets/:id/reply', authMiddleware, async (req, res) => {
  const db = await getDb();
  const { body } = req.body;
  if (!body) return res.status(400).json({ error: 'Body requerido' });
  await db.run('INSERT INTO ticket_replies (ticket_id, author, body, is_staff) VALUES (?, ?, ?, 1)', req.params.id, 'admin', body);
  await db.run("UPDATE support_tickets SET status='open', updated_at=datetime('now') WHERE id=?", req.params.id);
  res.json({ success: true });
});

router.get('/templates', authMiddleware, async (req, res) => {
  const db = await getDb();
  res.json(await db.all('SELECT * FROM email_templates ORDER BY created_at DESC'));
});

router.post('/templates', authMiddleware, async (req, res) => {
  const db = await getDb();
  const { name, subject, body } = req.body;
  if (!name || !subject || !body) return res.status(400).json({ error: 'Nombre, asunto y body requeridos' });
  const existing = await db.get('SELECT id FROM email_templates WHERE name = ?', name);
  if (existing) {
    await db.run("UPDATE email_templates SET subject=?, body=?, updated_at=datetime('now') WHERE id=?", subject, body, existing.id);
    return res.json({ success: true, id: existing.id });
  }
  const result = await db.run('INSERT INTO email_templates (name, subject, body) VALUES (?, ?, ?)', name, subject, body);
  res.json({ success: true, id: result.lastInsertRowid });
});

router.delete('/templates/:id', authMiddleware, async (req, res) => {
  const db = await getDb();
  await db.run('DELETE FROM email_templates WHERE id = ?', req.params.id);
  res.json({ success: true });
});

router.post('/email/send', authMiddleware, async (req, res) => {
  const { sendEmail } = await import('../email.js');
  const { to, subject, body, template_id } = req.body;
  if (!to || !subject || !body) return res.status(400).json({ error: 'Destinatarios, asunto y body requeridos' });
  const db = await getDb();
  const recipients = Array.isArray(to) ? to : [to];
  let sent = 0, failed = 0;
  for (const recipient of recipients) {
    const ok = await sendEmail(recipient, subject, body);
    if (ok) {
      await db.run('INSERT INTO email_log (template_id, recipient, subject, status) VALUES (?, ?, ?, ?)', template_id || null, recipient, subject, 'sent');
      sent++;
    } else {
      await db.run('INSERT INTO email_log (template_id, recipient, subject, status) VALUES (?, ?, ?, ?)', template_id || null, recipient, subject, 'failed');
      failed++;
    }
  }
  res.json({ success: true, sent, failed });
});

router.get('/email/log', authMiddleware, async (req, res) => {
  const db = await getDb();
  res.json(await db.all('SELECT * FROM email_log ORDER BY created_at DESC LIMIT 100'));
});

router.get('/db-info', authMiddleware, async (req, res) => {
  const db = await getDb();
  const tables = await db.all("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name");
  const info = {};
  for (const { name } of tables) {
    const cols = await db.all(`PRAGMA table_info(${name})`);
    const row = await db.get(`SELECT COUNT(*) as c FROM ${name}`);
    info[name] = { columns: cols, count: row.c };
  }
  res.json(info);
});

router.post('/db-query', authMiddleware, async (req, res) => {
  const { query } = req.body;
  if (!query || /drop|alter|create|insert|update|delete/i.test(query.trim()) && !query.trim().toLowerCase().startsWith('select')) {
    return res.status(400).json({ error: 'Solo consultas SELECT permitidas' });
  }
  try {
    const db = await getDb();
    const result = await db.all(query);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
