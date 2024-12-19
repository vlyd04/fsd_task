const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000; // Backend should run on a different port

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: "localhost", // Replace with your database host
    user: "root",      // Replace with your database username
    password: "lydiav@123",      // Replace with your database password
    database: "ems_db", // Replace with your database name
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("Connected to MySQL database.");
});

// Endpoint to handle form submission
app.post("/submit", (req, res) => {
    const {
        firstName,
        lastName,
        employeeId,
        email,
        phoneNumber,
        department,
        dateOfJoining,
        role,
    } = req.body;

    // Check for duplicate Employee ID or Email
    const duplicateCheckQuery = `
    SELECT * FROM employees WHERE employee_id = ? OR email = ?
  `;
    db.query(duplicateCheckQuery, [employeeId, email], (err, results) => {
        if (err) {
            console.error("Error checking duplicates:", err);
            return res.status(500).json({ message: "Database error while checking duplicates." });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: "Duplicate Employee ID or Email." });
        }

        // Insert new employee record
        const insertQuery = `
      INSERT INTO employees (first_name, last_name, employee_id, email, phone_number, department, date_of_joining, role)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

        db.query(
            insertQuery,
            [firstName, lastName, employeeId, email, phoneNumber, department, dateOfJoining, role],
            (err, result) => {
                if (err) {
                    console.error("Error inserting data:", err);
                    return res.status(500).json({ message: "Failed to insert data." });
                }
                res.status(200).json({ message: "Employee details saved successfully!" });
            }
        );
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
