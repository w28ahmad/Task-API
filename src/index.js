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

// const bcrypt = require('bcryptjs')

// myFunction = async() =>{
//     const password = "xcvbnm710961"
//     const hashedPass = await bcrypt.hash(password, 8)

//     console.log(password)
//     console.log(hashedPass)

//     const isMatch = await bcrypt.compare('xcvbnm710961', hashedPass)
//     console.log(isMatch)
// }

// myFunction()

const jwt = require('jsonwebtoken')

myFunc = async() =>{
    const token = jwt.sign({_id: 'abc123'}, 'thisismynewcourse', {expiresIn: "10 second"})
    console.log(token)

    const data = jwt.verify(token, 'thisismynewcourse')
    console.log(data)
}

myFunc()