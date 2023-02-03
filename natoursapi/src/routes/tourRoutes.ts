import { Router } from "express";

import { createTour, getAllTours } from "../controllers/tourController";

const router = Router();

router.get("/", getAllTours).post("/", createTour);

export default router;
