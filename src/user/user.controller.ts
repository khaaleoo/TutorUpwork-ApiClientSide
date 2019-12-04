
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UserModel, User } from "./user.model";
import { JWT_SECRET } from "../utils/secrets";
import { plainToClass } from "class-transformer";
import passport from "passport";
import "../auth/passport"

export class UserController {
    public async registerUser(req: Request, res: Response): Promise<void> {
        console.log("body", req.body);
        try {
            const userList = await UserModel.find({ email: req.body.email })
            console.log(userList)
            if (userList.length > 0) throw "User already exits"
            const result = await UserModel.create({
                email: req.body.email,
                password: req.body.password,
                role: req.body.role
            });
            res.status(200).send({ status: "OK", message: plainToClass(User, result) });
        } catch (error) {
            res.status(400).json({ status: "Error", message: error.message });
        }
    }

    public async authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        console.log("body", req.body);
        passport.authenticate("local", function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ status: "Error", message: "unauthorized" });
            } else {
                const token = jwt.sign({ email: user.email }, JWT_SECRET);
                console.log("token", token)
                return req.logIn(user, err => {
                    if (err) res.status(200).send({ status: "Error", message: err });
                    res.status(200).send({ status: "OK", message: "Success", token, user })
                })
            }
        })(req, res, next)
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        const result = await UserModel.find({});
        res.status(200).send({ status: "OK", message: result.map(val => plainToClass(User, val)) });
    }
}