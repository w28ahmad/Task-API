const express = require('express')
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')

const app = express()
const port = process.env.port || 3000

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log("Server is up on port "+ port)
})


// const jwt = require('jsonwebtoken')

// myFunc = async() =>{
//     const token = jwt.sign({_id: 'abc123'}, 'thisismynewcourse', {expiresIn: "10 second"})
//     console.log(token)

//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }

// myFunc()

const Task = require('./models/tasks')
const User = require('./models/user')

const main = async () =>{
    // const task = await Task.findById('5cd8aa3593b12645ec82bbfc')
    // await task.populate('owner').execPopulate()
    // console.log(task.owner)

    const user = await User.findById('5cd8ae8f94127c190cccf63e')
    await user.populate('tasks').execPopulate()    
    console.log(user.tasks)

}


// main()