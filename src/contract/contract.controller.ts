/* eslint-disable no-prototype-builtins */
import { ContractModel } from "./contract.model";
import { StudentModel } from "../student/student.model";
import { TutorModel } from "../tutor/tutor.model";

export class ContractController {
  public async createNewContract(req: any, res: any): Promise<any> {
    const { body } = req;
    const id = Date.now().toString();
    const reportInfo: String = "";
    const {
      studentId,
      tutorId,
      beginTime,
      endTime,
      pricePerHour,
      totalHour,
      totalPrice,
      status,
      skills
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
      skills,
      reportInfo
    });

    await TutorModel.update({ id: tutorId }, { $push: { contracts: id } });
    await StudentModel.update({ id: studentId }, { $push: { contracts: id } });

    res.status(200).json({ Status: "OK", data: { id } });
  }

  public async endContract(req: any, res: any): Promise<any> {
    console.log("end", req.body.id);
    const { body } = req;
    const { id } = body;
    const endTime = new Date();
    await ContractModel.updateOne(
      { id: id },
      { $set: { status: "Hoàn thành", endTime: endTime } }
    );
    res.status(200).json({ Status: "OK", idContract: id, endTime: endTime });
  }
  public async reportContract(req: any, res: any): Promise<any> {
    const { body } = req;
    const { id, reportInfo } = body;
    await ContractModel.updateOne(
      { id: id },
      { $set: { status: "Đang khiếu nại", reportInfo: reportInfo } }
    );
    res
      .status(200)
      .json({ Status: "OK", idContract: id, reportInfo: reportInfo });
  }

  public async changeStatus(req: any, res: any): Promise<any> {
    const { body } = req;
    const { id, status } = body;
    await ContractModel.updateOne({ id: id }, { $set: { status: status } });
    res.status(200).json({ Status: "OK", idContract: id, status: status });
  }

  public async loadContractByTimeRange(req: any, res: any): Promise<any> {
    const { body } = req;
    const { id, beginTime, endTime } = body;
    const result = await ContractModel.find({
      tutorId: id,
      beginTime: { $gt: beginTime, $lt: endTime }
    });
    res.status(200).json({ Status: "OK", tutorId: id, data: result });
  }
}
