import { Router } from "express";
import { ContractController } from "./contract.controller";
import passport from "passport";

export class ContractRoutes {
  public router: Router;
  public contractController: ContractController = new ContractController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post(
      "/new",
      passport.authenticate("jwt", { session: false }),
      this.contractController.createNewContract
    );
    this.router.post(
      "/end",
      passport.authenticate("jwt", { session: false }),
      this.contractController.endContract
    );
    this.router.post(
      "/report",
      passport.authenticate("jwt", { session: false }),
      this.contractController.reportContract
    );
    this.router.post(
      "/changestate",
      passport.authenticate("jwt", { session: false }),
      this.contractController.changeStatus
    );
    this.router.post(
      "/bytimerange",
      this.contractController.loadContractByTimeRange
    );
  }
}
