const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json());

const port = 8000;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'shyft'
})

app.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
})

db.connect(err => {
    if (err) {console.error('error connecting: ' + err.stack); return; }
    console.log(`Connected to database with ID ` + db.threadId);
});

app.get('/student', (req, res) => {
    db.query('SELECT * FROM student', (error, results) => {
        if (error) throw error;
        res.json(results);
    })
})