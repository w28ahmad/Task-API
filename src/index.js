const express = require('express')
// connection to mongoose and mangoDB database
require('./db/mongoose')

const userRouter = require('./routers/user')
const taskRouter = require('./routers/tasks')

// Setting up express
const app = express()
const port = process.env.PORT
app.use(express.json())

// The user router for user related routes and the task router for task related routes
app.use(userRouter)
app.use(taskRouter)

app.listen(port, ()=>{
    console.log("Server is up on port "+ port)
})

