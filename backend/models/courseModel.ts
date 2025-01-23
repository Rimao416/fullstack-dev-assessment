import mongoose, { Schema, Model, Document, Types } from "mongoose";

// Course interface
export interface ICourse extends Document {
  _id: Types.ObjectId;
  name: string;
  date: Date;
  subject: string;
  location: string;
  participants: number;
  notes: string;
  price: number;
  trainer_price: number;
  trainer: Types.ObjectId;
}

// Interface for static methods
export interface ICourseModel extends Model<ICourse> {
  isConflict(courseDate: Date, courseLocation: string): Promise<boolean>;
}

// Course schema
const CourseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: [true, "Please, provide a course name"],
      trim: true, // Trim added
    },
    date: {
      type: Date,
      required: [true, "Please, provide a course date"],
      validate: {
        validator: function (value: Date) {
          return value >= new Date();
        },
        message: "The course date must be in the future.",
      },
    },
    subject: {
      type: String,
      required: [true, "Please, provide a course subject"],
      trim: true, // Trim added
    },
    location: {
      type: String,
      trim: true, // Trim added
    },
    participants: { type: Number, required: true, min: 1, max: 50 },
    notes: {
      type: String,
      trim: true, // Trim added
    },
    price: {
      type: Number,
      required: [true, "Please, provide a course price"],
      min: [0, "Price cannot be negative"],
    },
    trainer_price: {
      type: Number,
      required: [true, "Please, provide a trainer price"],
      min: [0, "Trainer price cannot be negative"],
    },
    trainer: {
      type: Schema.Types.ObjectId,
      ref: "Trainer",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);


// Static method to check for scheduling conflicts
CourseSchema.statics.isConflict = async function (
  courseDate: Date,
  courseLocation: string
): Promise<boolean> {
  try {
    const conflict = await this.exists({
      date: courseDate,
      location: courseLocation,
    });
    return Boolean(conflict);
  } catch (error) {
    console.error("Error checking for scheduling conflict:", error);
    throw new Error("Failed to check for scheduling conflict.");
  }
};
CourseSchema.pre("validate", function (next) {  
  this.subject = this.subject.toLowerCase();
  next();
})

// Course model
const Course: ICourseModel = mongoose.model<ICourse, ICourseModel>(
  "Course",
  CourseSchema
);
export default Course;
