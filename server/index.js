const keys = require('./keys');

//export Application setup
const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(bodyparser.json())

const {Pool} = require('pg')
const pgClient = new Pool({
    User : keys.pgUser,
    Host : keys.pgHost,
    Database : keys.pgDatabase,
    Password : keys.pgPassword,
    Port : keys.pgPort,
});

pgClient.on("connect", Client =>{
    Client.query("CREATE TABLE IF NOT EXISTS valiues (number INT)").catch(err => console.log("PG error" , err));
});

app.get("/", (req, res)=>{
    res.send('hi')
})

app.get("/values/all" , async(req, res)=>
{
    const values = await pgClient.query("SELECT * FROM values");
    res.send(values);
})

//now the post -> insert values
app.post("/values", async(req, res)=>
{
   if (!req.body.value) res.send({working:false});
   pgClient.query("INSERT INTO values(number) VALUES($1)", [req.body.value]);
   res.send({working:true});
})

app.listen(5000, err=>{ console.log(`Listening on port 5000`)});