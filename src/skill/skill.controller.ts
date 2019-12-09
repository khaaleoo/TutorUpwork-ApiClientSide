import { NextFunction, Request, Response } from "express";
import { SkillModel, Skill } from "../skill/skill.model";
import { plainToClass } from "class-transformer";

export class SkillController {
  public async getAll(req: Request, res: Response): Promise<void> {
    const result = await SkillModel.find({});
    res.status(200).send({
      status: "OK",
      data: result
    });
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    const result = await SkillModel.find({
      name: req.url.replace("/", "")
    });
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
}
