const express = require('express')
const HttpError = require('../models/http-error')

const router = express.Router()

const DUMMY_PLACES = [
    {
        id : 'p1',
        title: 'North South University',
        description: 'Number 1 Private University in Bangladesh',
        location: {
            lat: 23.815103,
            lng : 90.425538
        },
        address: 'Dhaka 1229',
        creator: 'u1'
    }
]

//order of route matters 
router.get('/:pid', (req, res, next)=>{
    const place_id = req.params.pid 

    const place = DUMMY_PLACES.find( p =>{
        return p.id === place_id
    })

    if(!place) {
        throw new HttpError ('Could not find a place for the provided id.', 404)
    }

    res.json({place})
})

router.get('/user/:uid', (req, res, next)=>{
    const user_id = req.params.uid

    const place = DUMMY_PLACES.find( p =>{
        return p.creator === user_id
    })

    if(!place) {
        return next(new HttpError ('Could not find a place for the provided user id.', 404))
    }

    res.json({place})
})

module.exports = router