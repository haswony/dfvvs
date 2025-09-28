const mysql = require('mysql2');
require('dotenv').config();

// Connect without database to create it
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to MySQL server');

  // Create database
  connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`, (err, result) => {
    if (err) throw err;
    console.log('Database created or already exists');

    // Use the database
    connection.query(`USE ${process.env.DB_NAME}`, (err, result) => {
      if (err) throw err;

      // Drop and create users table
      connection.query('DROP TABLE IF EXISTS users', (err, result) => {
        if (err) throw err;
        const createTableQuery = `
          CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE,
            password VARCHAR(255),
            profile_pic VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `;
        connection.query(createTableQuery, (err, result) => {
          if (err) throw err;
          console.log('Users table created');
          connection.end();
        });
      });
    });
  });
});