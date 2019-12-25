import { Router } from "express";
import { SandBoxController } from "./sanbox.controller";
import passport from "passport";

export class SandBoxRoutes {
  public router: Router;
  public sandBoxController: SandBoxController = new SandBoxController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post(
      "/createpaymenturl",
      passport.authenticate("jwt", { session: false }),
      this.sandBoxController.createPaymentUrl
    );
    this.router.get("/vnpay_return", this.sandBoxController.checkData);
  }
}
