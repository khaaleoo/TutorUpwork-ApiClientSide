import { TutorModel } from "../tutor/tutor.model";
import { ContractModel } from "../contract/contract.model";
import { StudentModel } from "./student.model";

export class StudentController {
  public async getOne(req: any, res: any): Promise<void> {
    const result = await StudentModel.find({
      id: req.url.replace("/", "")
    });
<<<<<<< HEAD
    console.log(result);
    for (let i = 0; i < result[0].contracts.length; i += 1) {
      const contractsRes = await ContractModel.find({
        id: result[0].contracts[i]
      });
=======
>>>>>>> 307deb0a932e239ad590f328f74d84edbcdd4e10

    if (result.length !== 0) {
      for (let i = 0; i < result[0].contracts.length; i += 1) {
        const contractsRes = await ContractModel.find({
          id: result[0].contracts[i]
        });
<<<<<<< HEAD
        const temp = contractsRes[0].toObject();
        if (tutorRes[0] !== undefined) {
          temp.tutor = tutorRes[0].toObject();
        }
        result[0].contracts[i] = temp;
      } else {
        result[0].contracts[i] = "error";
=======

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
>>>>>>> 307deb0a932e239ad590f328f74d84edbcdd4e10
      }
    } else {
      res.status(200).send({
        status: "NotOk"
      });
    }

    res.status(200).send({
      status: "OK",
      data: result
    });
  }
  public updateOne(req: any, res: any) {
    const { body } = req;
    console.log("update student body", body);
    console.log(req.user.id);
    StudentModel.update(
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
}
