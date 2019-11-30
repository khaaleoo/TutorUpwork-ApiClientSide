import express, { Router } from "express";
const router = Router();
import UserController from "./user";
import AuthController from "./auth";

const assign: { path: string, controller: Router }[] = [
  {
    path: "/users",
    controller: UserController
  },
  {
    path: "/auth",
    controller: AuthController
  }
]



assign.forEach(({ path, controller }) => {
  router.use(path, controller);
})




export default router;
