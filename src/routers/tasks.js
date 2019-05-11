const express = require('express')
const Task = require('../models/tasks')

const router = new express.Router()

router.post('/tasks', async(req, res)=>{
    const task = new Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks', async(req, res)=>{
    try{
        tasks = await Task.find({})
        res.send(tasks)
    }catch(e){
        res.status(500).send()
    }

})


router.get('/tasks/:id', async(req, res)=>{
    const _id = req.params.id
    try{
        task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.send(500).send()
    }
})

router.patch("/tasks/:id", async(req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ["completed", "discription"]

    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Updates"})
    }
    
    try{
        const task = await Task.findById(req.params.id)
        updates.forEach((update)=>task[update] = req.body[update])
        await task.save()

        // This line does not take into account the middle ware for hashing the passwords
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators:true})

        if(!task){
            return res.status(400).send()
        }
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete("/tasks/:id", async(req,res)=>{
    try{
        const task = await Task.findByIdAndDelete(req.params.id) 
        
        if(!task){
            return res.status(400).send()
        }
        res.send(task)

    }catch(e){
        res.status(500).send()
    }
})


module.exports = router