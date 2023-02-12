import { Router } from "express";

import {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  aliasTopTours,
  getTourStats,
} from "../controllers/tourController";

const router = Router();

router.route("/top-5-cheapest").get(aliasTopTours, getAllTours);

router.route("/tour-stats").get(getTourStats);

router.route("/").get(getAllTours).post(createTour);

router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

export default router;
