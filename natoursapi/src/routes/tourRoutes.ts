import { Router } from "express";

import {
  createTour,
  getAllTours,
  getTour,
} from "../controllers/tourController";

const router = Router();

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour);

export default router;
