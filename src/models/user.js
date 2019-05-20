const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./tasks')

/* 
name, age, email, password,
tokens - stores the active tokens, avatar- holds the binary for an user profile picture,
timestamp- time when this user was created
*/
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        validate(value){
            if(value < 0){
                throw new Error("Something like age should be a positive number")
            }
        },
        default: 0
    },
    email:{
        type:String,
        unique:true,
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        },
        trim: true,
        lowerCase: true
    },
    password:{
        type:String,
        required:true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error("password can not be set as the password")
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

/*
Setting up a virtual property to connect the tasks to their users
match up the user._id with the owner id's
*/
userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

/*
    we create a token for the user instance using the user's unique _id and the secret set in the environment variables
    we add the token the the user model so that if a user logins in through different devices all the tokens are appended to the token array
    *methods is used to create a method for a single user instance
*/
userSchema.methods.generateAuthToken = async function (){
    const user = this
    const token = jwt.sign({_id : user._id.toString()}, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token
}

/*
When showing the profile to the user we only want them to see public information
So we filter the user by removing the password, tokens and avatar as this information should not be publicly avaliable
*/
userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


/*
    Finds user by their email
    Checks to see if the passwords match the hashed password stored in the DB
    if they do, return the user
    *statics is used for the User collection method
*/
userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error("Unable to login")
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error("Unable to login")
    }

    return user
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//Delete user task when user is removed
userSchema.pre('remove', async function (next){
    const user = this

    await Task.deleteMany({owner: user._id})

    next()
})

const User = mongoose.model('User',userSchema)


module.exports =  User