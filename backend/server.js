const express = require('express');
const pool = require('./db');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());


// Docker Postgres queries 
// app.get('/notes/:id', async (req,res)=>{
//     const id= req.params.id;
//     try {
//         const notes = await pool.query('SELECT * FROM notes WHERE id = $1',[id])
//         res.json(notes.rows)
//     } catch (error) {
//         console.log(error)
//     }
// })

// app.post('/notes/create/:id', async (req,res)=>{
//     const {title,desc} = req.body;
//     const {id} = req.params;
//     try{
//         await pool.query('INSERT INTO notes (notes_title, notes_desc, id) VALUES ($1, $2, $3)',[title,desc,id])
//         res.send('Note added')
//     }
//     catch(error){
//         console.log(error)
//     }
// })



app.get('/organizations', async (req,res)=>{

    const {id} = req.query;

    try{
        const organizations = await pool.query('SELECT * FROM organizations WHERE owner_id = $1',[id])

        res.send(organizations.rows);
    }catch(error){
        console.log(error)
    }
})

app.post('/organizations/create', async(req,res)=>{
    const {name,owner_id} = req.body;
    try{
        await pool.query('INSERT INTO organizations (name, owner_id) VALUES ($1, $2)',[name,owner_id])
        res.send("Organization created")
    }
    catch(error){
        console.log(error)
    }
})

app.get('/projects/:org_id', async (req,res)=>{
    const org_id = req.params.org_id;
    try{
        const projects = await pool.query('SELECT * FROM projects WHERE organization_id = $1',[org_id]);
        res.send(projects);
    }
    catch(error){
        console.log(error)
    }
})

app.post('/projects/create', async(req,res)=>{
    const {name,organization_id} = req.body;
    try{
        await pool.query('INSERT INTO projects (name, organization_id) VALUES ($1, $2)',[name,organization_id])
        res.send("Project created")
    }
    catch(error){
        console.log(error)
    }
})


const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})