const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')

const router = new express.Router()

router.post('/users', async(req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
    }catch(e){
        res.status(401).send(e)
    }
})

router.get('/users/me', auth, async(req, res)=>{
    res.send(req.user)

})

router.patch('/users/me', auth, async(req, res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']

    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })

    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Updates!"})
    }

    try{
        updates.forEach((update)=>req.user[update] = req.body[update])
        await req.user.save()

        // This line does not take into account the middle ware for hashing the passwords
        // const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators:true})

        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async(req, res)=>{
    try{
        await req.user.remove()

        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/login', async(req, res)=>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        
        res.send({user:user, token})
    }catch(e){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send()

    }catch(e){
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()

    }catch(e){
        res.status(500).send()
    }
})

const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, callback) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return callback(new Error("The file type should be jpg, jpeg or png"))
        }
        callback(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res)=>{
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

router.delete('/users/me/avatar', auth, async(req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req, res)=>{
    console.log("hi")
    try{
        const user = await User.findById(req.params.id)

        if(!user){
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    }catch(e){
        console.log(e)
        res.status(404).send()
    }
})

module.exports = router