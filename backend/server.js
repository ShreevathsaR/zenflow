const express = require('express');
const pool = require('./db');
const app = express();
const axios = require('axios');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/organizations', async (req, res) => {

    const { id } = req.query;

    try {
        const organizations = await pool.query('SELECT * FROM organizations WHERE owner_id = $1', [id])

        res.send(organizations.rows);
    } catch (error) {
        console.log(error)
    }
})

app.post('/organizations/create', async (req, res) => {
    const { name, owner_id } = req.body;
    try {
        await pool.query('INSERT INTO organizations (name, owner_id) VALUES ($1, $2)', [name, owner_id])
        res.send("Organization created")
    }
    catch (error) {
        console.log(error)
    }
})

app.get('/projects/:org_id', async (req, res) => {
    const org_id = req.params.org_id;
    try {
        const projects = await pool.query('SELECT * FROM projects WHERE organization_id = $1', [org_id]);
        res.send(projects);
    }
    catch (error) {
        console.log(error)
    }
})

app.get('/organization/users/:org_id', async (req, res) => {

    const org_id = req.params.org_id;
    try {
        const users = await pool.query('SELECT * FROM userorganizations WHERE organization_id = $1', [org_id]);
        res.send(users.rows);
    } catch (error) {
        console.log(error)
    }
})

app.post('/projects/create', async (req, res) => {
    const { name, organization_id } = req.body;
    try {
        await pool.query('INSERT INTO projects (name, organization_id) VALUES ($1, $2)', [name, organization_id])
        res.send("Project created")
    }
    catch (error) {
        console.log(error)
    }
})

app.post('/insertSections', async (req,res)=>{
    const {board_id,name,position} = req.body;  
    
    console.log(req.body)
    try{
        await pool.query('INSERT INTO sections (board_id ,name ,position) VALUES ($1,$2,$3)',[board_id,name,position])
        res.send("Board created")
    }
    catch(error){
        console.log(error)
    }
})

app.get('/', (req, res) => {
    res.status(200).send('Server is running');
  });

const serverUrl = 'https://zenflow-kclv.onrender.com';

const pingServer = () => {
  axios.get(serverUrl)
    .then(response => {
      console.log('Ping successful:', response.status);
    })
    .catch(error => {
      console.error('Ping failed:', error.message);
    });
};

// Ping every 5 minutes (300,000 milliseconds)
setInterval(pingServer, 300000);


const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})