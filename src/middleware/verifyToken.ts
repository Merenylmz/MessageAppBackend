import jwt, { JwtPayload } from 'jsonwebtoken';
import client from '../Redis/redisClient';
import { NextFunction, Request, Response } from "express";


const verifyToken = async(req: Request, res: Response, next: NextFunction) =>{
    try {
        const token = (req.query.token) as string;
        if (!token) { return res.send({status: false, msg: "Please give a Token"});}

        const decodedToken = (jwt.verify(token, "erenylmz_5728")) as JwtPayload; 

        const redisToken = await client.get(`lastLoginToken:${decodedToken["userId"]}`);

        if (!redisToken) {
            return res.send({status: false, msg: "Token is expired"});
        }
        else if (token != redisToken) {
            return res.send({status: false, msg: "Token is invalid"});
        }

        res.locals.userId = decodedToken["userId"];
        next();
    } catch (error) {
        return res.send({status: false, msg: error});
    }
};


export default verifyToken;