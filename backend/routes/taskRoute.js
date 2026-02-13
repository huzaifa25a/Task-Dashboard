const express = require('express');
const tasks = require('../models/task');
const protect = require('../middleware/middleware');

const router = express.Router();

 router.post('/addTask', protect, async (req, res) => {
    try{
        const {title, description, tags, status} = req.body;
        const user = req.user;

        if(!title){
            return res.status(400).json({message: 'Missing or invalid details!'});
        }

        const task = tasks.create({
            title: title,
            description: description,
            tags: tags,
            status: status,
            createdBy: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        })

        res.status(201).json({
            message: 'Task created!',
            task
        })
    }
    catch(err){
        res.status(400).json({message: 'Error creating task!'})
    }
 })

 router.get('/getTask', protect, async (req, res) => {
    const id = req.user.id;
    try{
        const taskList = await tasks.find({'createdBy.id': id}).sort({createdAt: -1})
        res.status(200).json({
            tasks: taskList
        })
    }
    catch(err){
        res.status(400).json({message: 'Error finding tasks'});
    }
 })

 router.delete('/deleteTask/:id', protect, async (req,res) => {
    try{
        const {id} = req.params;
        const task = await tasks.findByIdAndDelete({_id: id}, {returnDocument: 'after'})
        if(!task){
            return res.status(400).json({message: "Task does not exist!"});
        }
        res.status(200).json({
            task,
            message: "Task Deleted!"
        })
    }
    catch(err){
        res.status(401).json({message: "Unauthorized!"})
    }
 })

 router.put('/editTask/:id', protect, async (req, res) => {
    try{
        const {id} = req.params;
        const data = req.body;
        const task = await tasks.findByIdAndUpdate(id, data, {returnDocument: 'after'})
        if(task){
            console.log('Updated --->',task)
            res.status(201).json({
                task,
                message: 'Updated!'
            })
        }
    }
    catch(err){
        res.status(400).json({message: 'Unauthorized!'});
    }
 })

 module.exports = router;