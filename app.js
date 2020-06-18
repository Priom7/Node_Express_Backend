const express = require('express')
const body_Parser = require('body-parser')

const places_Routes = require('./routes/places-routes')

const app = express()

// => /api/places/...
app.use('/api/places',places_Routes)

app.use((error, req, res, next) => {
    if(res.headerSent) {
        return next (error)
    } 

    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred'})
})

app.listen(5000)