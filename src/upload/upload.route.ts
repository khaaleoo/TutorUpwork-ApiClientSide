import { Router } from "express";
import { UploadController } from "./upload.controller";
import passport from "passport"
export class UploadRoutes {
  public router: Router;
  public uploadController: UploadController = new UploadController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post("/", passport.authenticate("jwt", { session: false }), this.uploadController.upload);
  }
}
