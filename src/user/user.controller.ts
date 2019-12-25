import * as jwt from "jsonwebtoken";
import { UserModel, User } from "./user.model";
import { TutorModel, Tutor } from "../tutor/tutor.model";
import { StudentModel, Student } from "../student/student.model";
import { JWT_SECRET } from "../utils/secrets";
import { plainToClass } from "class-transformer";
import passport from "passport";
import "../auth/passport";
import { UserService } from "./user.service";
import nodemailer from "nodemailer";
import { host, emailPass, emailUser } from "../constant";
import { hashSync, compare } from "bcrypt";

const sendMail = (id: string, code: string, email: string) => {
  const smtpTransport = nodemailer.createTransport({
    host: "gmail.com",
    service: "Gmail",
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  var url = `${host}/user/verify?id=${id}&code=${code}`;
  var html = '<a href="' + url + '"><b>Bấm để xác thực </b></a>';
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Xác thực tài khoản",
    html
  };
  return smtpTransport.sendMail(mailOptions);
};

const sendForgotEmail = (code: string, email: string) => {
  const smtpTransport = nodemailer.createTransport({
    host: "gmail.com",
    service: "Gmail",
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });
  var html = `Code : <h1>${code}</h1>`;
  const mailOptions = {
    from: emailUser,
    to: email,
    subject: "Forgot password",
    html
  };
  return smtpTransport.sendMail(mailOptions);
};

export class UserController {
  async changePassword(req: any, res: any) {
    try {
      const { password, oldPassword } = req.body;
      const find = await UserModel.find({ id: req.user.id });
      if (find.length <= 0) throw new Error("Không tìm thấy tài khoản này nữa");
      if (await compare(oldPassword, find[0].password)) {
        await UserModel.update(
          { id: req.user.id },
          {
            $set: {
              password: hashSync(password, 10)
            }
          }
        );
        res.status(200).json({ status: "OK" });
      } else {
        throw new Error("Mật khẩu cũ sai");
      }
    } catch (err) {
      console.log(err);
      res.status(200).json({ status: "ERROR", message: err.message });
    }
  }
  public async requestVerify(req: any, res: any) {
    const find = await UserModel.find({ email: req.body.email });
    const code = `${Date.now()}`;
    console.log(req.body.email, find);
    if (req.body.email && find.length > 0) {
      if (find[0].valid)
        return res
          .status(200)
          .json({ status: "Tài khoản hiện đã kích hoạt sẵn rồi" });
      await sendMail(find[0].id, code, req.body.email);
      await UserModel.update(
        { email: req.body.email },
        {
          $set: {
            code
          }
        }
      );
      return res.status(200).json({ status: "Vui lòng xem email để xác thực" });
    }
    return res.status(200).json({ status: "Không tìm thấy email" });
  }
  public genCode() {
    return `${Date.now()}`;
  }
  public async getMe(req: any, res: any) {
    if (req.user.role === "tutor") {
      const tutorList = await TutorModel.find({ id: req.user.id });
      if (tutorList.length >= 0) return res.json(tutorList[0]);
    } else if (req.user.role === "student") {
      const studentList = await StudentModel.find({ id: req.user.id });
      if (studentList.length >= 0) return res.json(studentList[0]);
    }
    res.json({});
  }
  public async registerUser(req: any, res: any): Promise<void> {
    console.log("body", req.body);
    const { body } = req;
    const { email, password, role } = body;
    try {
      const userList = await UserModel.find({ email });
      if (userList.length > 0) throw "User already exits";
      const id = Date.now().toString();
      const code = `${Date.now()}`;
      await sendMail(id, code, email);
      const result = await UserModel.create({
        codePass: "",
        code,
        email,
        password,
        role,
        id,
        type: 1
      });
      if (req.body.role === "tutor") {
        await TutorModel.create(new Tutor({ ...req.body, id }));
      } else {
        await StudentModel.create(new Student({ ...req.body, id }));
      }
      res
        .status(200)
        .send({ status: "OK", message: plainToClass(User, result) });
    } catch (error) {
      console.log(error);
      res.status(400).json({ status: "Error", message: error.message });
    }
  }

  public async authenticateUser(req: any, res: any, next: any): Promise<void> {
    console.log("body", req.body);
    return passport.authenticate("local", async (err, user, mess) => {
      console.log(err, user, mess);
      if (err)
        return res.status(400).json({
          status: "VALID",
          message: err
        });
      if (!user) {
        return res.status(400).json({
          status: "Error",
          message: "Email hoặc password chưa đúng !"
        });
      }
      const info = await UserService.getInfo(user.id);
      console.log("usr:", { ...user, ...info });
      const token = jwt.sign(JSON.stringify({ id: user.id }), JWT_SECRET);
      res.status(200).send({
        status: "OK",
        message: "Success",
        token,
        user: { ...plainToClass(User, user), ...info }
      });
    })(req, res, next);
  }
  public async verfify(req: any, res: any) {
    const userList = await UserModel.find({
      id: req.body.id
    });
    if (userList.length > 0) {
      const user = userList[0];
      const info = await UserService.getInfo(user.id);
      const token = jwt.sign(JSON.stringify({ id: user.id }), JWT_SECRET);
      res.status(200).send({
        status: "OK",
        message: "Success",
        token,
        user: { ...plainToClass(User, user), ...info }
      });
    } else
      res.status(200).send({ status: "OK", message: "Success", user: false });
  }
  public async facebook(req: any, res: any): Promise<void> {
    console.log(req.body);
    const { body } = req;
    try {
      const user = {
        id: body.id,
        email: body.id + body.email,
        password: "123456",
        role: body.role,
        type: 2
      };
      await UserModel.create(user);
      const token = jwt.sign({ id: body.id }, JWT_SECRET);
      if (body.role === "tutor") {
        await TutorModel.create(new Tutor(body));
      } else {
        await StudentModel.create(new Student(body));
      }
      const info = await UserService.getInfo(user.id);
      res.status(200).send({
        status: "OK",
        message: "Success",
        token,
        user: { ...plainToClass(User, user), ...info }
      });
    } catch (error) {
      console.error(error);
      res.status(400).json({ status: "ERROR", message: error.message });
    }
  }
  public async google(req: any, res: any): Promise<void> {
    console.log(req.body);
    const { body } = req;
    try {
      const user = {
        id: body.id,
        email: body.id + body.email,
        password: "123456",
        role: body.role,
        type: 2
      };
      await UserModel.create(user);
      const token = jwt.sign({ id: body.id }, JWT_SECRET);
      if (body.role === "tutor") {
        await TutorModel.create(new Tutor(body));
      } else {
        await StudentModel.create(new Student(body));
      }
      const info = await UserService.getInfo(user.id);
      res.status(200).send({
        status: "OK",
        message: "Success",
        token,
        user: { ...plainToClass(User, user), ...info }
      });
    } catch (error) {
      res.status(400).json({ status: "ERROR", message: error.message });
    }
  }

  public async getAll(req: any, res: any): Promise<void> {
    const result = await UserModel.find({});
    res.status(200).send({
      status: "OK",
      message: result.map(val => plainToClass(User, val))
    });
  }

  public async EmailVerify(req: any, res: any) {
    const { code, id } = req.body;
    if (!code || !id)
      return res.status(200).json({ status: "FAILED", message: "WRONG CODE" });
    const findCode = await UserModel.find({ code, id });
    console.log("findcode", findCode);

    if (findCode.length > 0) {
      await UserModel.update(
        { code, id },
        {
          $set: {
            valid: true,
            code: ""
          }
        }
      );
      return res.status(200).json({ status: "OK", message: "SUCCESSFULL" });
    }
    res.status(200).json({ status: "FAILED", message: "WRONG CODE" });
  }
  public async ForgotPassRequest(req: any, res: any) {
    try {
      const find = await UserModel.find({ email: req.body.email });
      if (find.length <= 0) throw new Error("Không tìm thấy email");
      const code = `${Date.now()}`;
      const r = await sendForgotEmail(code, req.body.email);
      console.log(r);
      const updat = await UserModel.update(
        { email: req.body.email },
        {
          $set: {
            codePass: code
          }
        }
      );
      console.log(updat);
      res.status(200).json({ status: "OK" });
    } catch (e) {
      res.status(200).json({ status: "ERROR", message: e.message });
    }
  }
  public async ForgotPassChange(req: any, res: any) {
    try {
      const { email, password } = req.body;
      console.log("email", email);
      const update = await UserModel.update(
        {
          email: email
        },
        {
          $set: {
            password: hashSync(password, 10)
          }
        }
      );
      console.log(update);
      res.status(200).json({ status: "OK" });
    } catch (e) {
      res.status(200).json({ status: "ERROR", message: e.message });
    }
  }
  public async ForgotPassCode(req: any, res: any) {
    try {
      console.log("email", req.body.email);
      console.log("email", req.body.email);
      const find = await UserModel.find({
        email: req.body.email,
        codePass: req.body.code
      });
      if (find.length <= 0) throw new Error("Không tìm thấy email");
      res.status(200).json({ status: "OK" });
    } catch (e) {
      res.status(200).json({ status: "ERROR", message: e.message });
    }
  }
}
