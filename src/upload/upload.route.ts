import { Router } from "express";
import { UploadController } from "./upload.controller";

export class UploadRoutes {
  public router: Router;
  public uploadController: UploadController = new UploadController();

  constructor() {
    this.router = Router();
    this.routes();
  }
  multer = require("multer");
  upload = this.multer({
    dest: "./"
    // you might also want to set some limits: https://github.com/expressjs/multer#limits
  });
  routes() {
    this.router.post("/", this.upload.single("file", this.uploadController.upload));
  }
}
