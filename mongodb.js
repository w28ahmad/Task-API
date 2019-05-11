// CRUD Create, Read, Update, Delete

const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient
const {MongoClient, ObjectID} = require('mongodb');
// var id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());


const connectionURL = "mongodb://127.0.0.1:27017"
const databaseName = "task-manager"


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