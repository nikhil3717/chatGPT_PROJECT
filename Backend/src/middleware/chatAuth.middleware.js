const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

async function chatAuthMiddleware(req, res, next) {
   const {token} = req.cookies;
    
   if(!token){
    return res.status(401).json({message:"Unauthorized"})
   }

   const decoded = jwt.verify(token, process.env.JWT_SECRET);

   const user = await userModel.findOne({_id:decoded.id});

   if(!user) {
    return res.status(401).json({message:"Unauthorized"})
   }

   req.user = user
   next()
 }


module.exports = chatAuthMiddleware;