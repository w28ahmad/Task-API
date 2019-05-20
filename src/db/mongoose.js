const mongoose = require('mongoose')

// Connecting to mongoose, MONGODB_URL is an environment variable
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
