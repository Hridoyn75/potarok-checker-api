import mysql from "mysql2";

const db = mysql.createConnection({
    host: "hriwantdb01-hriwantdb.aivencloud.com",
    user: "avnadmin",
    port : 28542,
    password: "AVNS_alwbOypNs_tkEt5OV-W",
    database: "potarok_checker_db"
})
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database!');
});
export default db;