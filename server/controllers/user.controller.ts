import { Express, Request, Response } from "express";
import { User, userModel } from "../models/user.model";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email, and password are required" });
        }
        const userRegister = await userModel.create({ name, email, password });
        if (userRegister) {
            return res.status(201).json({ name: userRegister.name, email: userRegister.email, id: (userRegister as any)._id ?? userRegister._id })
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).json(`Something went wrong while try registed user, ${error.message}`);
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const userLogin = await userModel.findOne({email, password});
        if(userLogin) {
            return res.status(201).json({email: userLogin.email});
        }
    } catch (error: any) {
        console.error(error);
        return res.status(500).json(`Something went wrong while try to ligon user, ${error.message}`)
    }
}