import { Router } from "express";
import { ContractController } from "./contract.controller";

export class ContractRoutes {
  public router: Router;
  public contractController: ContractController = new ContractController();

  constructor() {
    this.router = Router();
    this.routes();
  }

  routes() {
    this.router.post("/new", this.contractController.createNewContract);
    this.router.post("/end", this.contractController.endContract);
    this.router.post("/report", this.contractController.reportContract);
    this.router.post("/changestate", this.contractController.changeStatus);
    this.router.post(
      "/bytimerange",
      this.contractController.loadContractByTimeRange
    );
  }
}
