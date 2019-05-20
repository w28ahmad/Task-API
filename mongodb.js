// CRUD Create, Read, Update, Delete
const mongodb = require('mongodb')
const {MongoClient, ObjectID} = require('mongodb');

const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"


// Connecting to the local instance of mongoDB
MongoClient.connect(connectionURL, {
    useNewUrlParser: true,
}, (error, client)=>{
    if(error){
        return console.log(error)
    }
    db = client.db(databaseName)
    
    db.collection('tasks').deleteOne({
        description: "Take out the trash",
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })
})