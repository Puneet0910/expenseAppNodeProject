const User = require('../models/userModel');

exports.signup = async (req,res,next)=>{
    try {
        const {name,email,password} = req.body;
        // check if email already exists
        const existingUser = await User.findOne({where:{email}});
        if(existingUser){
            return res.status(409).json({message:"Email Already Exists"});
        };
        const user = await User.create({name,email,password});
        return res.status(201).json({message:"Signup Successfull", user});
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Internal Server error"});
    }
};