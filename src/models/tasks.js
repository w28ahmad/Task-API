const mongoose = require('mongoose')

/*
Tasks model will consist of discription, weather or not the task is completed and an owner
The owner the user that created that task, the ref is a reference to the User model
*/
const taskSchema = new mongoose.Schema({

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

const Task = mongoose.model('Tasks', taskSchema)


module.exports = Task