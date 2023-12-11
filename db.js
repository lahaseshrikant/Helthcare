// db.js
const sqlite3 = require('sqlite3').verbose();

// open the database
let db = new sqlite3.Database('./data/mydatabase.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the mydatabase.db database.');
});

module.exports = db;