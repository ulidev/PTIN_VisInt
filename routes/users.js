express = require('express')
router = express.Router()
const User = require('../models/User')
require("mongoose").Promise = require("bluebird");
service = require("../handlers/token-service")
encryption = require("../handlers/encryption")

// Get a user giving ID
router.get('/:id', function(req, res, next) {
    User.findById(req.params.id)
    .then(doc => {
        res.send(doc)
    })
    .catch(e => {
        res.send({"status": "400"})
    })
});


router.put('/:id', async function(req, res, next) {
	if (!req.body.username || !req.body.password || !req.body.language) {
        res.status(400).send({"message": 'ERROR Fields missing'})
        return
    }

    let name = req.body.username;
    let pass = req.body.password
    let hashPassword = await encryption.encrypt(pass)
	let pref = req.body;
    User.findByIdAndUpdate(req.params.id,{
        $set: {
        	//set: req.body // Need test (/auth/signup not working)
        	username : name,
        	password : hashPassword,
            preferences : pref
        }
    }).then(u => {
        res.status(200).send({'message': 'Information changed'})
    }).catch(e => {
          res.status(400).send({"message": 'ERROR Something went wrong'})
    })
})

//Legacy/Deprecated function. In use: /auth/signup 
router.post('/', function(req, res, next) {
    let username = req.body.username
    let password = req.body.password

    if (!username || !password) {
        res.send({"status" : "400"})
        return
    }

    let u = new User({
        username: username,
        password: password
    })

    u.save()
        .then(doc => {
            res.send(doc)
        })
        .catch(e => {
            res.send(e)
        })
})

module.exports = router
