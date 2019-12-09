import { Router } from "express";
import { HomeController } from "./home.controller";

export class HomeRoutes {
  public router: Router;
  public homeController: HomeController = new HomeController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.get("/all", this.homeController.getAll);
    this.router.get("/special", this.homeController.getSpecial);
    this.router.get("/:id", this.homeController.getOne);
  }
}
