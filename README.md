# Task Manager REST API

### Table of Contents
* [Installation](#installation)
* [Routes](#routes)
* [Dependencies](#dependencies)
* [Future](#future)


### Installation
This API is publicly available at https://task-manager-api-ahmad.herokuapp.com, you can run it through postman or implement it in your Web App.

OR

```console
git clone https://github.com/w28ahmad/Task-Manager-API.git && cd Task-Manager-API
```

### Routes
* [Create an account](#create-an-account)
* [Delete a Task](#delete-a-task)
* [Documentation](#documentation)
* [Dependencies](#dependencies)
* [License](#license)

#### Create an account
Create an account to hold your tasks details. These user details are going to securely stored in a MongoDB Database.
```
POST: https://task-manager-api-ahmad.herokuapp.com/users
```

##### Example
```json
{
	"name": "Wahab Ahmad",
	"email": "email@gmail.com",
	"password": "testing123"
}
```

#### Login to your account
If you create an account you are automatically logged in. However, if you need to login you use the folloring route.
```
POST: https://task-manager-api-ahmad.herokuapp.com/users/login
```

##### Example
```json
{
	"email": "dan@gmail.ca",
	"password": "testing123"
}
```
#### Create a Task
To add a task that you have to complete, use the following route:
```
POST: https://task-manager-api-ahmad.herokuapp.com/tasks
```

##### Example
```json
{
	"discription": "Finish the Task Manager REST API",
	"completed" : false
	
}
```
> Note: If you don't specify completed, it will be set to false by default


#### Update a Task
If you need to change/update a task you use the following route:
```
PATCH: https://task-manager-api-ahmad.herokuapp.com/tasks/{task_id}
```

##### Example
```json
{
	"discription": "Finish the Task Manager REST API",
	"completed" : true
	//setting that task to true, you don't need to specify discription, I did it for the expample
}
```

#### Delete a Task
If you need to delete a task you can use the following route:
```
DELETE: https://task-manager-api-ahmad.herokuapp.com/tasks/{task_id}
```

#### Read a Task
If you want to read a task(s) use the following route:
```
GET: https://task-manager-api-ahmad.herokuapp.com/tasks
```
Here I have added parameters to filter, paginate and sort the results.
##### Pagination
```
GET: https://task-manager-api-ahmad.herokuapp.com/tasks/skip=3&limit=2
```
Here we are limiting the search result to tasks and skip sections the tasks

##### Sorting
```
GET: https://task-manager-api-ahmad.herokuapp.com/tasks?sortBy=createdAt:desc
```
This sorts the tasks in order of recency according to the timestamp
```
GET: https://task-manager-api-ahmad.herokuapp.com/tasks?sortBy=createdAt:asc
```
This sorts the tasks placing the the oldest tasks first
##### Filtering
```
GET: https://task-manager-api-ahmad.herokuapp.com/tasks?completed=false
```
This filters out the uncompleted tasks. Likewise setting completed to true will filter out the completed tasks. We can use all the methords together like so:
```
GET: https://task-manager-api-ahmad.herokuapp.com/tasks?skip=3&limit=2&completed=false&sortBy=createdAt:desc
```
#### Update a user
You are able to update the details of a user using:
```
PATCH: https://task-manager-api-ahmad.herokuapp.com/users/me
```

##### Example
```json
{
	"name": "Wab",
	"email": "myemail@gmail.com",
	"password": "testing1234"
}
```

#### Delete a user
You are able to delete your user and his/her tasks using the following route:
```
Delete: https://task-manager-api-ahmad.herokuapp.com/users/me
```
#### Read your user profile
You are able to read your user profile information through the following route:
```
GET: https://task-manager-api-ahmad.herokuapp.com/users/me
```

##### Example Response
```json
{
    "age": 0,
    "_id": "5cdf49eaa7135d00178bd58f",
    "name": "Wahab Ahmad",
    "email": "wab@gmail.com",
    "createdAt": "2019-05-17T23:55:22.608Z",
    "updatedAt": "2019-05-17T23:55:23.455Z",
    "__v": 1
}
```

#### Logout
Logout from your account using the following route:
```
POST: https://task-manager-api-ahmad.herokuapp.com/users/me
```

#### Upload a Profile Picture
I was interested in how to upload files so I created a route for uploading images:
```
POST: https://task-manager-api-ahmad.herokuapp.com/users/me/avatar
```

You can delete your avatar using the following route:
```
DELETE: https://task-manager-api-ahmad.herokuapp.com/users/me/avatar
```
The image is going to be resized and cropped, and then the binary will be stored in the Database. 

### Dependencies
1. Express
2. Multer
3. Sharp
4. Validator
5. Mongoose
6. Mongodb
7. jsonwebtoken
8. bcryptjs
9. @sendgrid/mail

### Future
In the future, I hope to use React and angular to create a front end that interacts with this REST API.
