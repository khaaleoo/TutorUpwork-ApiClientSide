import { Router } from "express";
import { StudentController } from "./student.controller";

export class StudentRoutes {
  public router: Router;
  public studentController: StudentController = new StudentController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/:id", this.studentController.getOne);
  }
}