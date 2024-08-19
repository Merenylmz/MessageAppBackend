import bcrypt from 'bcrypt';
import { Request, Response } from "express";
import client from "../Redis/redisClient";
import User from '../models/User';
import jwt from 'jsonwebtoken';
import emailQueue from '../Job/SendMailJob';


export const login = async(req: Request, res: Response)=>{
    try {
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.send({status: false, msg: "User is not found"});
        }

        const status = await bcrypt.compare(req.body.password, user.password);
        if (!status) {
            return res.send({status: false, msg: "Wrong Password"});
        }
        const token = jwt.sign({userId: user._id}, "erenylmz_5728");
        client.setEx(`lastLoginToken:${user._id}`, 60*60, token);
        user.lastLoginToken = token;
        await user.save();

        return res.send({status: true, token: token});
    } catch (error) {
        console.log(error);
    }
};

export const register = async(req: Request, res: Response) =>{
    try {
        const user = await User.findOne({email: req.body.email});
        if (user) {
            return res.send({status: true, msg: "User is Already Exists"});
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 11);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        });
        await newUser.save();

        await emailQueue.add({to: req.body.email, subject: "Welcome, My App", text: `
            <h1>Welcome App</h1>    
        `});

        return res.send({status: true, name: newUser.name});
    } catch (error) {
        console.log(error);
    }
};


export const logout = async(req: Request, res: Response) =>{
    try {
        const user = await User.findOne({_id: res.locals.userId});
        if (!user) {
            return res.send({status: true, msg: "User is not found"});
        }
        user.lastLoginToken = "";
        await client.del(`lastLoginToken:${user._id}`);
        user.save();

        res.send({status: true, msg: "Logouted"});
    } catch (error) {
        console.log(error);
    }
};


export const getUsersForChats = async(req: Request, res: Response) =>{
    try {
        const users = await User.find({_id: {$ne: res.locals.userId}});

        res.send(users);
    } catch (error) {
        console.log(error);
        
    }
};