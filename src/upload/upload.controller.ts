import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { UserModel, User } from "./upload.model";
import { JWT_SECRET } from "../utils/secrets";
import { plainToClass } from "class-transformer";
import passport from "passport";
import "../auth/passport";

export class UserController {
  public async upload(req: Request, res: Response): Promise<void> {
    console.log("body", req.body);
    // try {
    //   const userList = await UserModel.find({ email: req.body.email });
    //   console.log(userList);
    //   if (userList.length > 0) throw "User already exits";
    //   const result = await UserModel.create({
    //     email: req.body.email,
    //     password: req.body.password,
    //     role: req.body.role,
    //     type: 1
    //   });
    //   res
    //     .status(200)
    //     .send({ status: "OK", message: plainToClass(User, result) });
    // } catch (error) {
    //   res.status(400).json({ status: "Error", message: error.message });
    // }
  }

  public async authenticateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log("body", req.body);
    passport.authenticate("local", function (err, user, info) {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .json({ status: "Error", message: "unauthorized" });
      } else {
        const token = jwt.sign({ email: user.email }, JWT_SECRET);
        console.log("token", token);
        return req.logIn(user, err => {
          if (err) res.status(200).send({ status: "Error", message: err });
          res
            .status(200)
            .send({ status: "OK", message: "Success", token, user });
        });
      }
    })(req, res, next);
  }
  public async facebook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log("body", req.body);
    try {
      const userList = await UserModel.find({
        email: req.body.profile.response.id + "@facebook.com"
      });
      console.log(userList);
      let re = null;
      if (userList.length === 0) {
        re = await UserModel.create({
          email: req.body.profile.response.id + "@facebook.com",
          password: "abcdef",
          role: req.body.profile.role || "student",
          type: 2
        });
      } else {
        re = userList[0];
      }
      const token = jwt.sign({ email: re.email }, JWT_SECRET);
      res
        .status(200)
        .send({ status: "OK", message: "Success", token, user: re });
    } catch (error) {
      res.status(400).json({ status: "Error", message: error.message });
    }
  }
  public async google(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    console.log("body", req.body);
    try {
      const userList = await UserModel.find({
        email: req.body.profile.profile.googleId + "@google.com"
      });
      console.log(userList);
      let re = null;
      if (userList.length === 0) {
        re = await UserModel.create({
          email: req.body.profile.profile.googleId + "@google.com",
          password: "abcdef",
          role: req.body.profile.role || "student",
          type: 2
        });
      } else {
        re = userList[0];
      }
      const token = jwt.sign({ email: re.email }, JWT_SECRET);
      res
        .status(200)
        .send({ status: "OK", message: "Success", token, user: re });
    } catch (error) {
      console.log(error);
      res.status(400).json({ status: "Error", message: error.message });
    }
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    const result = await UserModel.find({});
    res.status(200).send({
      status: "OK",
      message: result.map(val => plainToClass(User, val))
    });
  }
}
