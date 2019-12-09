import { NextFunction, Request, Response } from "express";
import { TutorModel, Tutor } from "./tutor.model";
import { plainToClass } from "class-transformer";

export class TutorController {
  public async getAll(req: Request, res: Response): Promise<void> {
    const result = await TutorModel.find({});
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
  public async getSpecial(req: Request, res: Response): Promise<void> {
    const result = await TutorModel.find({ star: { $eq: 5 } }).limit(8);
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
  public async getOne(req: Request, res: Response): Promise<void> {
    console.log(req.url);
    const result = await TutorModel.find({
      id: req.url.replace("/", "")
    });
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
}
