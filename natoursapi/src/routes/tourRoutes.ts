import { Router } from "express";

import { createTour } from "../controllers/tourController";

const router = Router();

router.post("/", createTour);

export default router;
