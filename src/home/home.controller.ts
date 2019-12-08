import { NextFunction, Request, Response } from "express";
import { TutorModel, Tutor } from "../tutor/tutor.model";
import { plainToClass } from "class-transformer";

export class HomeController {
  public async getAll(req: Request, res: Response): Promise<void> {
    const result = await TutorModel.find({});
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
  public async getSpecial(req: Request, res: Response): Promise<void> {
    const result = await TutorModel.find({ star: { $eq: 4.5 } });
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
  public async getOne(req: Request, res: Response): Promise<void> {
    const result = await TutorModel.find({
      email: req.url.replace("/", "")
    });
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
}
