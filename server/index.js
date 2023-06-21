const keys = require("./keys");

// Express Application setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors({
    origin: '*'
}));


app.use(bodyParser.json());

// Postgres client setup
const { Pool } = require("pg");
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on("connect", client => {
    client
        .query("CREATE TABLE IF NOT EXISTS values (number INT)")
        .catch(err => console.log("PG ERROR", err));
});

//Express route definitions
app.get("/", (req, res) => {
    res.send("Hi");
});

// get the values
app.get("/values/all", async (req, res) => {
    const values = await pgClient.query("SELECT * FROM values");

    res.send(values);
});

// now the post -> insert value
app.post("/values", async (req, res) => {
    try {
        await pgClient.query("INSERT INTO values(number) VALUES($1)", [req.body.value]);
        res.send({ working: true });
    } catch (error) {
        console.error("Error executing PostgreSQL query:", error);
        res.send({ working: false, error: "Error executing query" });
    }

});









// Define API endpoints
// Define API endpoints
app.post('/signup', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Check if the username or email already exists in the database
      const existingUser = await pgClient.query(
        'SELECT * FROM users WHERE username = $1 OR email = $2',
        [username, email]
      );
  
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ error: 'Username or email already exists' });
      }
  
      // Insert the new user into the database
      const newUser = await pgClient.query(
        'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
        [username, email, password]
      );
  
      res.json({ message: 'Signup successful', user: newUser.rows[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  


app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username and password match the stored data in the database
        const user = await pool.query(
            'SELECT * FROM users WHERE username = $1 AND password = $2',
            [username, password]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        res.json({ message: 'Login successful', user: user.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});



app.listen(5000, err => {
    console.log("Listening");
});