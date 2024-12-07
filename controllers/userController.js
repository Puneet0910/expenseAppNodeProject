const User = require('../models/userModel');

const bcrypt = require('bcrypt');

exports.signup = async (req,res,next)=>{
    try {
        const {name,email,password} = req.body;
        // check if email already exists
        const existingUser = await User.findOne({where:{email}});
        if(existingUser){
            return res.status(409).json({message:"Email Already Exists"});
        };
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({name,email,password:hashedPassword});
        return res.status(201).json({message:"Signup Successfull", user});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server error"});
    }
};
exports.login = async (req,res,next)=>{
    try {
        const {email,password} = req.body;
        const user = await User.findOne({where:{email}});
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        };
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid Password"});
        };
        return res.status(200).json({message:"Login Successfull", user});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server error"});
    }
};