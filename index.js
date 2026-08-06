require('dotenv').config()
const mongoose = require('mongoose');
const express = require('express');
const Url = require('./models/Url')

const app = express();
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)
    .then(()=> console.log('MongoDB connected ✅'))
    .catch((err)=> {
        console.error('MongoDB connection failed ❌:', err.message)
        process.exit(1)
    })


app.get('/', (req, res)=>{
    res.send("Hello, Url Shortene")
})

const urlDatabase = {}
let idCounter = 1

app.post('/shorten', async (req, res) => {
    const {longUrl } = req.body

    if(!longUrl) {
        return res.status(400).json({ error: "long url is required"})
    }

    try {
        const count = await Url.countDocuments()
        const shortCode = (count + 1).toString(36)

        const url = await Url.create({ shortCode, longUrl})

        res.status(201).json({
            shortCode: url.shortCode,
            shortUrl: `http://localhost:3000/${url.shortCode}`,
        })
    }catch(err){
        console.error('Error creating short URL:', err.message)
        res.status(500).json({ error: 'Internal server error' })
    }
})

app.get('/:shortCode', (req, res)=> {
    const { shortCode } = req.params;

    const longUrl = urlDatabase[shortCode]

    if (!longUrl) {
        return res.status(404).json({ error: 'Short URL not found'})
    }
    res.redirect(302, longUrl)
})

app.get('/:shortCode', async (req, res) => {
    const {shortCode } = req.params;
    const url = await Url.findOne({shortCode})
    if(!url) return res.status(404).json({error: 'Short URL not found'})

})

app.listen(3000, ()=>{
    console.log("Server is running on http://localhost:3000")
})
