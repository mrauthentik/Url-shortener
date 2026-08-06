require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');

const app = express();
app.use(express.json())
app.get('/', (req, res)=>{
    res.send("Hello, Url Shortener")
})

const urlDatabase = {}
let idCounter = 1

app.post('/shorten', (req,res)=>{
    const { longUrl } = req.body

    if(!longUrl) {
        return res.status(400).json({ error: "longUrl is required"})
    }

    const shortCode = idCounter.toString(36)
    idCounter++

    urlDatabase[shortCode] = longUrl

    res.status(201).json({
        shortCode,
        shortUrl: `http://localhost:3000/${shortCode}`
    })
})

app.get('/:shortCode', (req, res)=> {
    const { shortCode } = req.params;

    const longUrl = urlDatabase[shortCode]

    if (!longUrl) {
        return res.status(404).json({ error: 'Short URL not found'})
    }
    res.redirect(302, longUrl)
})

app.listen(3000, ()=>{
    console.log("Server is running on http://localhost:3000")
})
