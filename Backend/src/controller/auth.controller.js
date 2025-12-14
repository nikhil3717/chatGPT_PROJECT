const userModel = require("../models/user.model");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function registerController(req, res)  {
  const { fullName:{firstName, lastName}, email, password } = req.body;
   
    const existingUser = await userModel.findOne({email});

    if(existingUser)  {
      return res.status(400).json({message:"User already exists"})
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await userModel.create({
        fullName:{
          firstName,
           lastName
        }, 
        email,
        password: hashedPassword
    })


    const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
    res.cookie("token", token, {secure: true, maxAge: 1 * 60 * 60 * 1000})

    return res.status(201).json({message:"User created successfully", user: {
       id: user._id,
       firstName: user.fullName.firstName,
       lastName: user.fullName.lastName,
       email: user.email
    }})
}

async function loginController(req, res)  {
  const { email, password } = req.body;
  
  const user = await userModel.findOne({email});
  
  if(!user)  {
    return res.status(400).json({message:"Invalid email or password"})
  }

  const isPasswordCorrect = await bcryptjs.compare(password, user.password)

  if(!isPasswordCorrect)  {
    return res.status(400).json({message:"Invalid email or password"})
  }

  const token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: "1h"})
  res.cookie("token", token, {secure: true, maxAge: 1 * 60 * 60 * 1000})

  return res.status(200).json({message:"Login successful", user: {
    id: user._id,
    firstName: user.fullName.firstName,
    lastName: user.fullName.lastName,
    email: user.email
  }})
}


module.exports  = {registerController , loginController}
