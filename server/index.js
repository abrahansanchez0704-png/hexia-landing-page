import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import submissionsRouter from './routes/submissions.js';
import adminRouter from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3001;
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(cors());
app.use(express.json());

app.use('/api', submissionsRouter);
app.use('/api/admin', adminRouter);

app.use('/admin', express.static(resolve(__dirname, 'public/admin')));

const distPath = resolve(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(resolve(distPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`HEXIA backend running on http://localhost:${PORT}`);
});
