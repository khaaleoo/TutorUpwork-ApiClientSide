import { TutorModel } from "../tutor/tutor.model";
import { ContractModel } from "../contract/contract.model";
import { StudentModel } from "./student.model";

export class StudentController {
  public async getOne(req: any, res: any): Promise<void> {
    const result = await StudentModel.find({
      id: req.url.replace("/", "")
    });
    for (let i = 0; i < result[0].contracts.length; i += 1) {
      const contractsRes = await ContractModel.find({
        id: result[0].contracts[i]
      });

      if (contractsRes[0] !== undefined) {
        const tutorRes = await TutorModel.find({
          id: contractsRes[0].tutorId
        });
        const temp = contractsRes[0].toObject();
        if (tutorRes[0] !== undefined) {
          temp.tutor = tutorRes[0].toObject();
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
}
