const express = require('express');
const pool = require('./db');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/notes/:id', async (req,res)=>{
    const id= req.params.id;
    try {
        const notes = await pool.query('SELECT * FROM notes WHERE id = $1',[id])
        res.json(notes.rows)
    } catch (error) {
        console.log(error)
    }
})

app.post('/notes/create/:id', async (req,res)=>{
    const {title,desc} = req.body;
    const {id} = req.params;
    try{
        await pool.query('INSERT INTO notes (notes_title, notes_desc, id) VALUES ($1, $2, $3)',[title,desc,id])
        res.send('Note added')
    }
    catch(error){
        console.log(error)
    }

})
const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})