
import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UserModel, User } from "./user.model";
import { JWT_SECRET } from "../utils/secrets";
import { plainToClass } from "class-transformer";
import passport from "passport";
import "../auth/passport"

export class UserController {
    public async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const userList = await UserModel.find({ email: req.body.email })
            if (userList.length > 0) throw "User already exits"
            const result = await UserModel.create({
                username: req.body.email,
                password: req.body.password,
                role: "student"
            });
            res.status(200).send({ status: "OK", message: plainToClass(User, result) });
        } catch (error) {
            res.status(400).json({ status: "Error", message: error });
        }
    }

    public async authenticateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        passport.authenticate("local", function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ status: "Error", message: "unauthorized" });
            } else {
                const token = jwt.sign({ email: user.email }, JWT_SECRET);
                req.logIn(user, err => {
                    if (err) res.status(200).send({ status: "Error", message: err });
                    res.status(200).send({ status: "OK", message: "Success", token })
                })
            }
        })(req, res, next)
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        const result = await UserModel.find({});
        res.status(200).send({ status: "OK", message: result.map(val => plainToClass(User, val)) });
    }
}