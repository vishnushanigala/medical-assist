const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const UserModel = require('../models/UserModel.js');

const router = express.Router();
// const __dirname = path.resolve();

router.use(cookieParser());

router.post('/login', async (req, res) => {
    try {
        
        const { email, password, role} = req.body;
        const user = await UserModel.findOne({ "email" : email });
       

        if (!user) {
            res.json({status : "fail",message : "user does not exists !"})
            return;
        }
       
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch || role!=user.role) {
            res.json({status : "fail",message : "Invalid Credentials !"})
           
            return ;
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.TOKEN, { expiresIn: '3h' });
        res.cookie('token', token, { httpOnly: true });
        const res_role=user.role;
        res.json({status : "success",token,res_role,user})
    } catch (error) {
        res.json({status : "fail",message : "Internal Error !"})    }
});


router.post('/register', async (req, res) => {
    try {
       
        const { email, username, password, role } = req.body;
        const userExists = await UserModel.findOne({ email});
        if (userExists) {
            res.json({status : "fail",message : "user already exists !"})
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({ email, username, password: hashedPassword, role });
        
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.TOKEN, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true });
        

        res.json({status : "success",token,role})
    } catch (error) {
        res.json({status : "fail",message : "Internal Error !"})
    }
});

module.exports= router;
