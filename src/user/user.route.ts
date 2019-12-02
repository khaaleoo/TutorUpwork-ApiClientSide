import { Router } from "express";
import { UserController } from "./user.controller";

export class UserRoutes {

    public router: Router;
    public userController: UserController = new UserController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.post("/register", this.userController.registerUser);
        this.router.post("/login", this.userController.authenticateUser);
        this.router.get("/", this.userController.getAll);
    }
}