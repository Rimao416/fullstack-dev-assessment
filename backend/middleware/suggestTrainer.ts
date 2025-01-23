import Course, { ICourse } from "../models/courseModel";
import trainerModel, { ITrainer } from "../models/trainerModel";
import { format } from "date-fns";

export const suggestTrainer = async (
  courseSubject: string,
  courseDate: Date
): Promise<ITrainer | null> => {
  // Normalize the input date to the format "YYYY-MM-DD"
  const normalizedCourseDate = format(courseDate, "yyyy-MM-dd");

  // Retrieve all trainers and their courses
  const trainers: ITrainer[] = await trainerModel.find({});
  const courses: ICourse[] = await Course.find({});

  // Filter trainers qualified for the subject
  for (const trainer of trainers) {
    if (trainer.training_subjects.includes(courseSubject)) {
      
      // Check if the trainer is busy on the same date
      const isTrainerOccupied = courses.some((course) => {
        if (!course.trainer || !course.date) {
          return false; // Ignore courses without a trainer or date
        }

        // Normalize the course date from the database
        const normalizedCourseDBDate = format(new Date(course.date), "yyyy-MM-dd");
        // Check if the trainer is busy on that day
        return (
          course.trainer.toString() === trainer._id.toString() &&
          normalizedCourseDBDate === normalizedCourseDate
        );
      });

      // If the trainer is not busy, return them
      if (!isTrainerOccupied) {
        return trainer;
      }
    }
  }

  // If no trainer is found, return null
  return null;
};