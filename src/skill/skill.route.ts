import { Router } from "express";
import { SkillController } from "./skill.controller";

export class SkillRoutes {
  public router: Router;
  public skillController: SkillController = new SkillController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/all", this.skillController.getAll);
    this.router.get("/", this.skillController.getAll);
  }
}
