import { TutorModel } from "./tutor.model";
import { ContractModel } from "../contract/contract.model";
import { StudentModel } from "../student/student.model";

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
  public async comment(req: any, res: any): Promise<any> {
    const { body } = req;
    const { authorId, content, datetime, tutorId } = body;
    await TutorModel.update(
      { id: tutorId },
      { $push: { comment: { authorId, content, datetime } } }
    );
    res.status(200).json({ Status: "OK", comment: { content } });
  }
}
