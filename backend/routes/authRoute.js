const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const user = require('../models/user');
const protect = require('../middleware/middleware')

const router = express.Router();

router.post('/register', async (req, res) => {
    try{
        const {name, email, password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message: 'Missing or invalid details!'});
        }
        const exists = await user.findOne({email: email});
        if(exists){
            return res.status(400).json({message: 'User already exists!'});
        }

        const pswd = await bcrypt.hash(password, 11);
        
        const _user = await user.create({
            name: name,
            email: email,
            password: pswd
        }) 

        const token = jwt.sign(
            {id: _user._id, name: _user.name, email: _user.email}, 
            process.env.JWT_SECRET, 
            {expiresIn: '1h'}
        );

        res.status(201).json({
            user: {name: _user.name, email: _user.email},
            token
        })
    }
    catch(err){
        res.status(500).json({message: 'Server error'})
    }
})

router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Missing or invalid details!'});
        }

        const _user = await user.findOne({email: email});

        if(!_user){
            return res.status(400).json({message: `User doesn't exist!`});
        }

        const verify = await bcrypt.compare(password, _user.password);

        if(!verify){
            return res.status(401).json({message: 'Password is Incorrect!'});
        }

        const token = jwt.sign(
            {id: _user._id, name: _user.name, email: _user.email},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        )

        res.status(200).json({
            user: {name: _user.name, email: _user.email},
            token
        })
    }
    catch(err){
        res.status(500).json({message: 'Server error'})
    }
})

module.exports = router;