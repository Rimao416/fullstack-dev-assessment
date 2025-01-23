import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import courseModel from "../models/courseModel";
import AppError from "../utils/appError";
import trainerModel from "../models/trainerModel";
import mongoose from "mongoose";
import { format } from "date-fns";

export const getCourses = catchAsync(async (req: Request, res: Response) => {
  const courses = await courseModel.find().populate({
    path: "trainer",
    select: "-courses",
  });
  res.status(200).json({
    status: "success",
    data: courses,
  });
});

export const getSingleCourse = catchAsync(
  async (req: Request, res: Response) => {
    const course = await courseModel.findById(req.params.id).populate({
      path: "trainer",
      select: "-courses",
    });
    res.status(200).json({
      status: "success",
      data: course,
    });
  }
);

export const createCourse = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // CHECK IF COURSE EXISTS
    const existingCourse = await courseModel.findOne({ name: req.body.name });

    if (existingCourse) {
      return next(
        new AppError(
          `A course with the name ${req.body.name} already exists`,
          400
        )
      );
    }
    const course = await courseModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: course,
    });
  }
);

/**
 * Checks if there is a schedule conflict for a given course.
 * @param courseDate - The date of the course to check.
 * @param location - The location of the course.
 * @returns Returns true if a conflict exists, otherwise false.
 */
export const checkScheduleConflict = async (
  courseDate: string,
  location: string
): Promise<boolean> => {
  const existingCourse = await courseModel.findOne({
    date: courseDate,
    location,
  });
  return !!existingCourse;
};

/**
 * Suggests the optimal trainer based on the subject and availability.
 * @param courseSubject - The subject being taught.
 * @param courseDate - The date of the course.
 * @returns Returns the ID of the suggested trainer or null if none is available.
 */
export const suggestBestTrainer = async (
  courseSubject: string,
  courseDate: string
): Promise<string | null> => {
  // 1. Find all trainers who teach this subject
  const trainers = await trainerModel.find({
    training_subjects: courseSubject,
  });

  // 2. Check the availability of trainers (avoid duplicates)
  for (const trainer of trainers) {
    const trainerId = (trainer as { _id: string })._id;
    const isUnavailable = await courseModel.exists({
      date: courseDate,
      trainer: trainerId,
    });

    if (!isUnavailable) {
      return trainerId.toString();
    }
  }
  return null; // No trainer available
};

export const assignTrainer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { trainerEmail } = req.body;

    // Check if the course exists
    const course = await courseModel.findById(id);
    if (!course) return next(new AppError("Course not found", 404));

    // Check if the trainer exists
    const trainer = await trainerModel.findOne({ email: trainerEmail });
    if (!trainer) return next(new AppError("Trainer not found", 404));

    // Ensure trainer._id is an ObjectId
    const trainerId = trainer._id as mongoose.Types.ObjectId;
    const formattedCourseDate = format(new Date(course.date), "yyyy-MM-dd");

    // Check if the trainer is already assigned to a course on the same day
    const trainerHasCourse = await courseModel.findOne({
      trainer: trainerId, // Using the converted `trainerId`
      date: formattedCourseDate,
    });

    if (trainerHasCourse) {
      return next(
        new AppError("Trainer already assigned to another course", 400)
      );
    }

    // Assign the trainer to the course
    course.trainer = trainerId; // Using the `trainerId`
    await course.save({ validateBeforeSave: false });

    return res.json({ message: "Trainer assigned successfully", course });
  }
);

export const updateCourse = catchAsync(async (req: Request, res: Response) => {
  const course = await courseModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: course,
  });
});

export const deleteCourse = catchAsync(async (req: Request, res: Response) => {
  await courseModel.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getStats = catchAsync(async (req: Request, res: Response) => {
  const totalCourses = await courseModel.countDocuments();
  const totalTrainers = await trainerModel.countDocuments();
  const upcomingCourses = await courseModel.countDocuments({
    date: { $gte: new Date() },
  });
  const completedCourses = await courseModel.countDocuments({
    date: { $lt: new Date() },
  });

  res.json({
    totalCourses,
    totalTrainers,
    upcomingCourses,
    completedCourses,
  });
});