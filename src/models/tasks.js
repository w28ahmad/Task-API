const mongoose = require('mongoose')
// const validator = require('validator')


const userSchema = new mongoose.Schema({

    discription:{
        type: String,
        trim: true,
        required: true
    },
    completed:{
        type: Boolean,
        default: false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, {
    timestamps: true
})

const Task = mongoose.model('Tasks', userSchema)


module.exports = Task