import { NextFunction, Response } from "express";
import catchAsync from "../utils/catchAsync";
import { AuthRequest } from "./authController";
import AppError from "../utils/appError";
import trainerModel from "../models/trainerModel";
import { suggestTrainer } from "../middleware/suggestTrainer";
import sendEmail from "../utils/email";

export const getTrainerInfo = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = await trainerModel.findById(req.userId); // Retrieve the user based on userId

    if (!user) {
      return next(new AppError("User not found", 404));
    }
    res.status(200).json({
      name: user.name,
      email: user.email,
    });
  }
);

export const getAllTrainers = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const users = await trainerModel.find().select("+password"); // Retrieve all users
    res.status(200).json({
      status: "success",
      data: users,
    });
  }
);

export const createTrainer = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    // Check if email exists
    const emailExists = await trainerModel.findOne({ email: req.body.email });

    if (emailExists) {
      return next(
        new AppError("This email already exists, please use another email", 400)
      );
    }
    const trainer = await trainerModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: trainer,
    });
  }
);

export const getSingleTrainer = catchAsync(
  async (req: AuthRequest, res: Response) => {
    const trainer = await trainerModel.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: trainer,
    });
  }
);

export const updateTrainer = catchAsync(
  async (req: AuthRequest, res: Response) => {
    // Transform training subjects into an array of strings if necessary
    if (
      req.body.training_subjects &&
      Array.isArray(req.body.training_subjects)
    ) {
      req.body.training_subjects = req.body.training_subjects.map(
        (subject: any) =>
          typeof subject === "object" && subject.value ? subject.value : subject
      );
    }

    const trainer = await trainerModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!trainer) {
      return res.status(404).json({
        status: "fail",
        message: "Trainer not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: trainer,
    });
  }
);

export const suggestTrainerController = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { courseSubject, courseDate } = req.query;

    // Validate inputs
    if (!courseSubject || !courseDate) {
      return next(new AppError("Missing courseSubject or courseDate.", 400));
    }

    // Ensure courseDate is a string
    const dateString = Array.isArray(courseDate) ? courseDate[0] : courseDate;
    if (typeof dateString !== "string") {
      return next(new AppError("Invalid courseDate format.", 400));
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return next(new AppError("Invalid courseDate format.", 400));
    }

    // Call the suggestTrainer function
    const trainer = await suggestTrainer(courseSubject as string, date);

    if (!trainer) {
      return next(new AppError("No suitable trainer found.", 404));
    }
    await sendEmail(
      trainer.email,
      "Trainer suggestion",
      `Hello ${trainer.name},

We are pleased to inform you that you have been assigned to a new training session.

📌 Course Subject: ${courseSubject}
📌 Location: Online / In-Person (as per schedule)

Please confirm your availability at your earliest convenience.

Best regards,  
The My Company Team
`
    );

    res.status(200).json({
      status: "success",
      data: { trainer },
    });
  }
);

export const deleteTrainer = catchAsync(
  async (req: AuthRequest, res: Response) => {
    await trainerModel.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  }
);