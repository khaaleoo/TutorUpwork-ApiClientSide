import { Router } from "express";
import { TutorController } from "./tutor.controller";

export class TutorRoutes {
  public router: Router;
  public tutorController: TutorController = new TutorController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/all", this.tutorController.getAll);
    this.router.get("/special", this.tutorController.getSpecial);
    this.router.get("/:id", this.tutorController.getOne);
    this.router.post("/filter", this.tutorController.getByFilters);
  }
}
