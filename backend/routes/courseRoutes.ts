import { Router } from "express";
import {
  assignTrainer,
  createCourse,
  deleteCourse,
  getCourses,
  getSingleCourse,
  getStats,
  updateCourse,
} from "../controllers/courseController";
import { checkCourseConflict } from "../middleware/checkCourseConflict ";
const router: Router = Router();
// router.use(protect);
router.route("/").get(getCourses).post(checkCourseConflict, createCourse);
router.route("/stat").get(getStats);

router
  .route("/:id")
  .get(getSingleCourse)
  .put(updateCourse)
  .delete(deleteCourse);
router.put("/:id/assign-trainer", assignTrainer);


export default router;
