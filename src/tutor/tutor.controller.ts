/* eslint-disable no-prototype-builtins */
import { TutorModel } from "./tutor.model";
import { ContractModel } from "../contract/contract.model";
import { StudentModel } from "../student/student.model";
import { UserService } from "../user/user.service";

export class TutorController {
  public updateOne(req: any, res: any) {
    const { body } = req;
    console.log(body);
    console.log(req.user.id);
    TutorModel.update(
      { id: req.user.id },
      {
        $set: {
          ...body
        }
      },
      (err, raw) => {
        console.log("result", err, raw);
        res.status(200).json("sdfsd");
      }
    );
  }
  public async getAll(req: Request, res: any): Promise<void> {
    const result = await TutorModel.find({});
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
  public async getByFilters(req: any, res: any): Promise<void> {
    const filter = req.body;
    let skill = {};
    if (filter.skills && filter.skills.length !== 0) {
      skill = { skills: { $all: filter.skills } };
    }
    let city = {};
    if (filter.city !== false) {
      city = { "address.city": filter.city };
      console.log(filter.city);
    }
    let district = {};
    if (filter.district !== false) {
      district = { "address.district": filter.district };
    }

    console.log(filter.price);
    const result = await TutorModel.find({
      $and: [
        { price: { $gt: filter.price[0] } },
        { price: { $lt: filter.price[1] } },
        { ...skill },
        { ...city },
        { ...district }
      ]
    });
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
  public async getSpecial(req: any, res: any): Promise<void> {
    const result = await TutorModel.find({ star: { $eq: 5 } }).limit(8);
    res.status(200).send({
      status: "OK",
      data: result
    });
  }
  public async getOne(req: any, res: any): Promise<void> {
    const result = await TutorModel.find({
      id: req.url.replace("/", "")
    });

    for (let i = 0; i < result[0].contracts.length; i += 1) {
      const contractsRes = await ContractModel.find({
        id: result[0].contracts[i]
      });

      if (contractsRes[0] !== undefined) {
        const studentRes = await StudentModel.find({
          id: contractsRes[0].studentId
        });
        const temp = contractsRes[0].toObject();
        if (studentRes[0] !== undefined) {
          temp.student = studentRes[0].toObject();
        }
        result[0].contracts[i] = temp;
      } else {
        result[0].contracts[i] = "error";
      }
    }

    res.status(200).send({
      status: "OK",
      data: result
    });
  }

  public async getListComment(req: any, res: any): Promise<any> {
    const tutorId = req.params.id;
    const result = await TutorModel.find({ id: tutorId });
    if (result.length > 0) {
      const obj = result[0].toObject();

      for (let i = 0; i < result[0].comments.length; i += 1) {
        if (obj.comments[i].hasOwnProperty("idAuthor")) {
          const author = await UserService.getInfo(
            result[0].comments[i].idAuthor.toString()
          );

          if (author.hasOwnProperty("avatar")) {
            obj.comments[i].avatar = author.avatar;
          } else {
            obj.comments[i].avatar = "";
          }
        } else {
          obj.comments[i] == "error";
        }
      }
      res.status(200).json({
        Status: "OK",
        result: obj.comments
      });
    } else {
      res.status(200).json({
        Status: "NotOk",
        result: []
      });
    }
  }
  public async comment(req: any, res: any): Promise<any> {
    const { body } = req;
    const { authorId, content, datetime, tutorId } = body;
    console.log(body.tutorId);
    const id = await TutorModel.updateOne(
      { id: tutorId },
      { $push: { comments: { idAuthor: authorId, content, datetime } } }
    );
    const student = await StudentModel.find({ id: authorId });
    console.log(student);
    if (id.n === 0 || student.length === 0) {
      res.status(200).json({
        Status: "NotOK"
      });
    } else
      res.status(200).json({
        Status: "OK",
        authorId: authorId,
        avatar: student[0].avatar,
        datetime: datetime,
        content: content
      });
  }
}
