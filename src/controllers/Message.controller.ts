import { Request, Response } from "express";
import Message from "../models/Message.model";

export const sendMessage = async(req: Request, res: Response) =>{
    try {
        const {receiverId, content} = req.body;
        const senderId = res.locals.userId;

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content
        });
        await newMessage.save();

        res.send({status: true, newMessage});
    } catch (error) {
       res.send(error); 
    }
};

export const getMessages = async(req: Request, res: Response) =>{
    try {
        const senderId = res.locals.userId;
        const receiverId = req.params.receiverId;

        const messages = await Message.find({
            $or: [
                {sender: senderId, receiver: receiverId},
                {sender: receiverId, receiver: senderId},
            ]
        }).sort({timestamp: 1});

        res.send(messages);
    } catch (error) {
        res.send(error);
    }
};