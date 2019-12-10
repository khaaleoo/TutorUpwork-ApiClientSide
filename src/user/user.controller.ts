import * as jwt from "jsonwebtoken";
import { UserModel, User } from "./user.model";
import { TutorModel, Tutor } from "../tutor/tutor.model";
import { JWT_SECRET } from "../utils/secrets";
import { plainToClass } from "class-transformer";
import passport from "passport";
import "../auth/passport";

export class UserController {
  public async getMe(req: any, res: any) {
    if (req.user.role === "tutor") {
      const tutorList = await TutorModel.find({ id: req.user.id });
      console.log(tutorList);
      res.json(tutorList[0]);
      return;
    }
    res.json({})
  }
  public async registerUser(req: any, res: any): Promise<void> {
    console.log("body", req.body);
    const { body } = req;
    const { email, password, role } = body;
    try {
      const userList = await UserModel.find({ email });
      if (userList.length > 0) throw "User already exits";
      const id = Date.now().toString();
      const result = await UserModel.create({
        email,
        password,
        role,
        id,
        type: 1
      });
      if (req.body.role === "tutor") {
        await TutorModel.create(new Tutor(req.body, id));
      }
      res
        .status(200)
        .send({ status: "OK", message: plainToClass(User, result) });
    } catch (error) {
      res.status(400).json({ status: "Error", message: error.message });
    }
  }

  public async authenticateUser(req: any, res: any, next: any): Promise<void> {
    console.log("body", req.body);
    passport.authenticate("local", (err, user) => {
      if (err) return next(err);
      if (!user) {
        return res
          .status(401)
          .json({
            status: "Error",
            message: "Email hoặc password chưa đúng !"
          });
      } else {
        const token = jwt.sign(JSON.stringify({ id: user.id }), JWT_SECRET);
        res.status(200).send({
          status: "OK",
          message: "Success",
          token,
          user: plainToClass(User, user)
        });
      }
    })(req, res, next);
  }
  public async facebook(req: any, res: any): Promise<void> {
    console.log("body", req.body);
    try {
      const userList = await UserModel.find({
        email: req.body.profile.response.id + "@facebook.com"
      });
      console.log(userList);
      let re = null;
      const id = Date.now().toString();
      if (userList.length === 0) {
        re = await UserModel.create({
          id: id,
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
  public async google(req: any, res: any): Promise<void> {
    console.log("body", req.body);
    try {
      const userList = await UserModel.find({
        email: req.body.profile.profile.googleId + "@google.com"
      });
      console.log(userList);
      let re = null;
      const id = Date.now().toString();
      if (userList.length === 0) {
        re = await UserModel.create({
          id: id,
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

  public async getAll(req: any, res: any): Promise<void> {
    const result = await UserModel.find({});
    res.status(200).send({
      status: "OK",
      message: result.map(val => plainToClass(User, val))
    });
  }
}
