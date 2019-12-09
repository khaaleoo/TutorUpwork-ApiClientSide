import express, { Router } from "express";
const router = Router();
import { UserRoutes } from "./user/user.route";
import { HomeRoutes } from "./home/home.route";
import { SkillRoutes } from "./skill/skill.route";

// import { AuthRoutes } from "./auth/auth.route";

const assign: { path: string; controller: Router }[] = [
  {
    path: "/",
    controller: new UserRoutes().router
  },
  {
    path: "/home",
    controller: new HomeRoutes().router
  },
  {
    path: "/skill",
    controller: new SkillRoutes().router
  }
  // {
  //   // path: "/",
  //   // controller: new AuthRoutes().router,

  // }
];

assign.forEach(({ path, controller }) => {
  router.use(path, controller);
});

export default router;
