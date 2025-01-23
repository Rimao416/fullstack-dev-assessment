import { Router } from "express";
// import { protect } from "../controllers/authController";
import {
  createTrainer,
  deleteTrainer,
  getAllTrainers,
  getSingleTrainer,
  getTrainerInfo,
  suggestTrainerController,
  updateTrainer,
} from "../controllers/trainerController";
const router: Router = Router();
// router.use(protect); if you want to protect all routes
router.get("/", getAllTrainers);
router.post("/", createTrainer);
router.get("/suggest", suggestTrainerController);
router.get("/me", getTrainerInfo);
router
  .route("/:id")
  .get(getSingleTrainer)
  .put(updateTrainer)
  .delete(deleteTrainer);
export default router;
