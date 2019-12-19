

import { UserModel } from './user.model';
import { TutorModel } from "../tutor/tutor.model";
import { StudentModel } from "../student/student.model"
export class UserService {
  public static async getInfo(id: string) {
    const res = await UserModel.find({ id });
    if (res.length > 0) {
      if (res[0].role === "tutor") {
        const tutors = await TutorModel.find({ id });
        if (tutors.length > 0) return ({
          name: tutors[0].name,
          avatar: tutors[0].avatar,
          id
        })
        return { id };
      }
      else {
        const students = await StudentModel.find({ id });
        if (students.length > 0) return ({
          name: students[0].name,
          avatar: students[0].avatar,
          id
        })
        return { id };
      }
    }
    return { id };
  }
}
