import { createClient } from '@libsql/client';

let client;
let schemaPromise;

function fixRow(row) {
  if (!row) return row;
  const r = {};
  for (const [k, v] of Object.entries(row)) {
    r[k] = typeof v === 'bigint' ? Number(v) : v;
  }
  return r;
}

function fixRows(rows) {
  return rows.map(fixRow);
}

export async function getDb() {
  if (!client) {
    client = createClient({
      url: process.env.TURSO_DB_URL || 'file:./data.db',
      authToken: process.env.TURSO_DB_TOKEN,
    });
    schemaPromise = initSchema();
  }
  await schemaPromise;
  return {
    all: async (sql, ...params) => {
      const rs = await client.execute({ sql, args: params, format: 'object' });
      return fixRows(rs.rows);
    },
    get: async (sql, ...params) => {
      const rs = await client.execute({ sql, args: params, format: 'object' });
      return fixRow(rs.rows[0]);
    },
    run: async (sql, ...params) => {
      const rs = await client.execute({ sql, args: params });
      return { changes: rs.rowsAffected, lastInsertRowid: Number(rs.lastInsertRowid) };
    },
    exec: async (sql) => {
      await client.execute(sql);
    },
  };
}

async function initSchema() {
  const tables = [
    `CREATE TABLE IF NOT EXISTS newsletter_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS project_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      country_code TEXT,
      phone TEXT,
      company TEXT DEFAULT '',
      role TEXT DEFAULT '',
      industry TEXT,
      project_type TEXT,
      project_details TEXT,
      documents TEXT DEFAULT '[]',
      nda INTEGER DEFAULT 0,
      budget TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT DEFAULT '',
      country_code TEXT DEFAULT '',
      company TEXT DEFAULT '',
      role TEXT DEFAULT '',
      industry TEXT DEFAULT '',
      notes TEXT DEFAULT '',
      status TEXT DEFAULT 'lead',
      source TEXT DEFAULT 'web',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS support_tickets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_phone TEXT DEFAULT '',
      company TEXT DEFAULT '',
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      priority TEXT DEFAULT 'normal',
      status TEXT DEFAULT 'open',
      assigned_to TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS ticket_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      is_staff INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
    )`,
    `CREATE TABLE IF NOT EXISTS email_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS email_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      template_id INTEGER,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      status TEXT DEFAULT 'sent',
      created_at TEXT DEFAULT (datetime('now'))
    )`,
  ];
  for (const sql of tables) {
    await client.execute(sql);
  }
}
