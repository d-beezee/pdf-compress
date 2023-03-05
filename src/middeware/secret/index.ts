import dotenv from 'dotenv';
import { NextFunction, Request, Response } from "express";

dotenv.config();

export default function (req: Request, res: Response, next: NextFunction) {
    if (!req.query || !req.query.key || req.query.key != process.env.KEY) {
        return res.status(403).send("Invalid key");
    }
    next();

};