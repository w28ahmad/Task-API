const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail, GoodbyeEmail} = require('./../emails/account')

const router = new express.Router()

/*
This is the signup route
Creates a user document
Creates a token for authentication for the other routes
*/
router.post('/users', async(req, res)=>{
    const user = new User(req.body)
    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()

        res.status(201).send({user, token})
    }catch(e){
        res.status(401).send(e)
    }
})

//Returns your profile information, recall this information in filtered using toJSON method. So tokens, password and avatar information will not show up
router.get('/users/me', auth, async(req, res)=>{
    res.send(req.user)

})

// This route allows you to change you profile information as long as you are authenticated
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

/*
This route deletes your user and your tasks collection, if you are authenticated
Sends a goodBye email
*/
router.delete('/users/me', auth, async(req, res)=>{
    try{
        GoodbyeEmail(req.user.email, req.user.name)
        await req.user.remove()

        res.send(req.user)
    }catch(e){
        console.log(e)
        res.status(500).send()
    }
})

// login route
router.post('/users/login', async(req, res)=>{
    try{
        // Finds the write user from the User collection
        const user = await User.findByCredentials(req.body.email, req.body.password)
        // Creates a token for this user instance
        const token = await user.generateAuthToken()
        
        res.send({user:user, token})
    }catch(e){
        res.status(400).send()
    }
})

/*
if the authenticated user logs out remove the their token
*/
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

// logs out of all the devices that are logged into your user by removing your tokens
router.post('/users/logoutAll', auth, async (req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()

    }catch(e){
        res.status(500).send()
    }
})

/*
Using multer to restrict the file size to 1 megabite
Checking to see if the file is an image
*/
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

/*
Using sharp to pre-process the images
1. Auto cropping the images to a size of 250x250 square at the center of the image
2. Converting jsp or jpeg files to png
3. turning the image into type Buffer for saving the image in the DB
*/
router.post('/users/me/avatar', auth, upload.single('avatar'), async(req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next)=>{
    res.status(400).send({error: error.message})
})

// Deletes your avatar from your user document
router.delete('/users/me/avatar', auth, async(req, res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// An public route used to test avatars and show them in the web
router.get('/users/:id/avatar', async(req, res)=>{
    try{
        const user = await User.findById(req.params.id)

        if(!user){
            throw new Error()
        }

        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    }catch(e){
        console.log(e)
        res.status(404).send()
    }
})

module.exports = router