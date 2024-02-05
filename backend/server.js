const express = require('express')
const mysql = require('mysql')
const cors = require('cors')

const path = require('path');
const app = express()
app.use(cors())
app.use(express.json());
app.use(express.static(path.resolve('../frontend/build')))

const port = 8000;

const db = mysql.createConnection({                     //Create Connection
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'shyft'
})

app.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
})

db.connect(err => {                                   //Error detection
    if (err) {console.error('error connecting: ' + err.stack); return; }
    console.log(`Connected to database with ID ` + db.threadId);
});

app.get('/student_data', (req, res) => {            //Student table api endpoint and query
    db.query('SELECT * FROM student', (error, results) => {
        if (error) throw error;
        res.json(results);
    })
})
app.post('/student_data/upload', (req, res) => {    //Student table insertion api endpoint
    const sql = "INSERT INTO student (`fname`, `lname`, `dob`) VALUES (?,?,?)"
    const values = [
        req.body.fname,
        req.body.lname,
        req.body.dob
    ]
    db.query(sql, values, (err, data) => {          //Insert data into student table
        if (err) {
            console.error(err);
            return res.status(500).json({error: "An Error has occured when inserting data"});
        }
        db.query('SELECT * FROM student', (error, results) => {     //Returning updated table in api response
            if (error) throw error; 
            res.json(results);
        })
    })
})

app.get('/courses_data', (req, res) => {
    db.query('SELECT * FROM courses', (error, results) => {
        if (error) throw error;
        res.json(results);
    })
})

app.post('/courses_data/upload', (req, res) => {
    const sql = "INSERT INTO courses (`cname`) VALUES (?)"
    const values = [
        req.body.cname,
    ]
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({error: "An Error has occured when inserting data"});
        }
        db.query('SELECT * FROM courses', (error, results) => {
            if (error) throw error;
            res.json(results);
        })
    })
})

app.get('/results_data', (req, res) => {
    db.query('SELECT * FROM results', (error, results) => {
        if (error) throw error;
        res.json(results);
    })
})

app.post('/results_data/upload', (req, res) => {
    const sql = "INSERT INTO results (`cname`, `sname`, `score`) VALUES (?,?,?)"
    const values = [
        req.body.cname,
        req.body.sname,
        req.body.score,
    ]
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error(err);s
            return res.status(500).json({error: "An Error has occured when inserting data"});
        }
        db.query('SELECT * FROM results', (error, results) => {
            if (error) throw error;
            res.json(results);
        });
    })
})




