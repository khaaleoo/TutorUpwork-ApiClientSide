import { Router } from "express";
import { getAll, getOne, post } from "./auth.controler";

const router = Router();

router.get("/", getAll);
router.get("/:id", getOne);
router.post("/", post);

export default router;
