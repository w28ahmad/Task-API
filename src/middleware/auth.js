const jwt = require('jsonwebtoken')
const User = require('../models/user')

/*
Authenticating the User
Only 2 routes that are public, the sign up route and login route, everything else requires the user to be authenticated
With all other routes, there will be an authorization key value pair storing the token
We use the JWT_SECRET defined in the environment variables to check if the token is valid
If its valid we can grab the user from the user collection via the user._id stored in the token
storing the user in req.user, so the user is available to the other routes
*/
const auth = async(req, res, next)=>{
    try{
        const token = req.header('Authorization').replace("Bearer ", "")
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id:decoded._id, "tokens.token":token})
        
        if(!user){
            throw new Error()
        }

        req.token = token
        req.user = user
        next()
    }catch(e){
        res.status(401).send({error: "Please authenticate"})
    }

}

module.exports = auth