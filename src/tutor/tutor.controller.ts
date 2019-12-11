import { NextFunction, Request, Response } from "express";
import { TutorModel, Tutor } from './tutor.model';
import { plainToClass } from "class-transformer";

export class TutorController {
  public updateOne(req: any, res: Response) {
    const { body } = req;
    console.log(body);
    console.log(req.user.id)
    TutorModel.update({ id: req.user.id }, {
      $set: {
        ...body
      }
    }, (err, raw) => {
      console.log("result", err, raw);
      res.status(200).json("sdfsd");
    }
    )
  }
  public async getAll(req: Request, res: Response): Promise<void> {
    const result = await TutorModel.find({});
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
  public async getByFilters(req: Request, res: Response): Promise<void> {
    const filter = req.body;
    const param = [];
    // { skills: { $all: ["HTML", "CSS"] } },

    if (filter.city) {
      param.push(`{"address.city":${filter.city}}`);
    }
    if (filter.district) {
      param.push(`{"address.district":${filter.district}}`);
    }
    if (filter.skills) {
      param.push(`skills: { $all: ${filter.skills}}`);
    }

    console.log(filter.price);
    const result = await TutorModel.find({
      $and: [
        { price: { $gt: filter.price[0] } },
        { price: { $lt: filter.price[1] } }
      ]
    });
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
    const result = await TutorModel.find({
      id: req.url.replace("/", "")
    });
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
}
