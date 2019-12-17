/* eslint-disable no-prototype-builtins */
import { ContractModel } from "./contract.model";
import { StudentModel } from "../student/student.model";
import { TutorModel } from "../tutor/tutor.model";

export class ContractController {
  public async createNewContract(req: any, res: any): Promise<any> {
    const { body } = req;
    const id = Date.now().toString();
    const {
      studentId,
      tutorId,
      beginTime,
      endTime,
      pricePerHour,
      totalHour,
      totalPrice,
      status,
      skill
    } = body;
    console.log(body);
    await ContractModel.create({
      id,
      studentId,
      tutorId,
      beginTime,
      endTime,
      pricePerHour,
      totalHour,
      totalPrice,
      status,
      skill
    });

    await TutorModel.update({ id: tutorId }, { $push: { contracts: id } });
    await StudentModel.update({ id: studentId }, { $push: { contracts: id } });

    res.status(200).json({ Status: "OK", data: { id } });
  }
}
