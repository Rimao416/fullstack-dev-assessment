import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";
import courseModel from "../models/courseModel";

// Middleware to check if the course has a scheduling conflict
export const checkCourseConflict = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { date, location } = req.body;

  const hasConflict = await courseModel.isConflict(date, location);

  if (hasConflict) {
    return next(new AppError("Another course is already scheduled at this date and location.", 400));
  }

  next();
};