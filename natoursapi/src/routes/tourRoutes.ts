import { Router } from "express";

import {
  createTour,
  getAllTours,
  getTour,
  updateTour,
} from "../controllers/tourController";

const router = Router();

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour);

export default router;
