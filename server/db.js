import Database from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { dirname, resolve } from 'path';

const DB_PATH = process.env.DATABASE_PATH || './data.db';

let db;

export function getDb() {
  if (!db) {
    const dir = dirname(resolve(DB_PATH));
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initSchema();
  }
  return db;
}

function initSchema() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS newsletter_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS project_submissions (
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
    );

    CREATE TABLE IF NOT EXISTS clients (
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
    );

    CREATE TABLE IF NOT EXISTS support_tickets (
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
    );

    CREATE TABLE IF NOT EXISTS ticket_replies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticket_id INTEGER NOT NULL,
      author TEXT NOT NULL,
      body TEXT NOT NULL,
      is_staff INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (ticket_id) REFERENCES support_tickets(id)
    );

    CREATE TABLE IF NOT EXISTS email_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS email_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      template_id INTEGER,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      status TEXT DEFAULT 'sent',
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
}
