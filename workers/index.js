import { Client, logger } from 'camunda-external-task-client-js';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const sqlite = sqlite3.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dbPath = path.resolve(__dirname, 'cv.db');

const db = new sqlite.Database(dbPath, sqlite.OPEN_CREATE | sqlite.OPEN_READWRITE, err => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database');
  }
});
process.on('exit', () => {
  db.close(err => {
    if (err) {
      return console.error('Error closing database:', err.message);
    }
    console.log('Closed the SQLite database connection');
  });
});
db.on('error', err => {
  console.error('Database error:', err.message);
});

const query = `CREATE TABLE IF NOT EXISTS files (
    id INTEGER PRIMARY KEY,
    date TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now', 'localtime')),
    filename TEXT
  )
`;
db.run(query, [], err => {
  if (err) {
    console.error('Error executing query:', err.message);
  } else {
    console.log('Query executed successfully');
  }
});

// db.run(`delete from files`, [], function (err) {
//   if (err) {
//     return console.error('Error calling stored procedure:', err.message);
//   }
// });

const getAllFilesAndLast = () => {
  db.all(`SELECT * FROM files`, [], (err, rows) => {
    console.log('Te gjitha CV-te e ruajtura', rows);
    if (rows && rows.length >= 1) {
      const date = new Date(rows[rows.length - 1].date * 1).toISOString().split('T')[0];
      console.log(`CV e fundit e ruajtur: [id=> ${rows[rows.length - 1].id}] [Date=> ${date}] [Emri=> ${rows[rows.length - 1].filename}]`);
    }
    if (err) {
      console.error('Error executing query:', err.message);
    } else {
      console.log('Query executed successfully');
    }
  });
};

const config = { baseUrl: 'http://localhost:8080/engine-rest', use: logger };
const client = new Client(config);

client.subscribe('ruan_cv', async function ({ task, taskService }) {
  console.log('Duke ruajtur CV ne databaze...');
  db.run(`INSERT INTO files (id , date, filename) VALUES (?,?,?);`, [null, Date.now(), 'CV.pdf'], function (err) {
    if (err) {
      return console.error('Error calling stored procedure:', err.message);
    }
    console.log(`CV u ruajt ne databaze`);
  });
  getAllFilesAndLast();

  await taskService.complete(task);
});

client.subscribe('dergo_feedback_finance', async function ({ task, taskService }) {
  console.log('Duke derguar feedback ne lidhje me kandidatin tek departamenti i finances...');
  setTimeout(() => {
    console.log('Feedback u dergua me sukses');
  }, 1000);
  getAllFilesAndLast();

  await taskService.complete(task);
});

getAllFilesAndLast();
