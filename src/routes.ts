import express, { Router } from "express";
const router = Router();
import { UserRoutes } from "./user/user.route";

const assign: { path: string, controller: Router }[] = [
  {
    path: "/users",
    controller: new UserRoutes().router
  }
]

assign.forEach(({ path, controller }) => {
  router.use(path, controller);
})

export default router;
