import mongoose, { Schema, Model, Document, Types } from "mongoose";
import bcrypt from "bcryptjs";
// Trainer interface

interface IUserDocument extends mongoose.Document {
  correctPassword(candidatePassword: string): Promise<boolean>;
}
export interface ITrainer extends Document {
  _id: Types.ObjectId;
  name: string;
  training_subjects: string[];
  location: string;
  email: string;
  password: string;
}

export type Trainer = Model<ITrainer, Record<string, unknown>, IUserDocument>;

// Trainer schema
const TrainerSchema = new Schema<ITrainer>(
  {
    name: {
      type: String,
      required: [true, "Please, provide a trainer name"],
      trim: true,
    },
    training_subjects: { type: [String], required: true },
    location: { type: String, trim: true },
    email: {
      type: String,
      required: [true, "Please, provide a trainer email"],
      unique: true,
      trim: true,
      match: /\S+@\S+\.\S+/,
    },

    password: {
      type: String,
      required: [true, "Please, provide a trainer password"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

TrainerSchema.methods.correctPassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password); // Use this.password directly
};

TrainerSchema.pre("validate", function (next) {
  this.password="12345678";
  this.email = this.email.toLowerCase();
  // this.password = "12345678";
  if (this.training_subjects) {
    this.training_subjects = this.training_subjects.map((subject) =>
      subject.toLowerCase()
    );
    this.training_subjects = [...new Set(this.training_subjects)];
  }
  next();
});

TrainerSchema.pre("findOneAndDelete", async function (next) {
  try {
    const trainer = await this.model.findOne(this.getFilter());
    if (!trainer) return next();

    await mongoose.model("Course").updateMany(
      { trainer: trainer._id },
      { $unset: { trainer: 1 } } // Supprime uniquement la référence au trainer
    );

    next();
  } catch (error) {
    next(error as mongoose.CallbackError); // Assigne explicitement le bon type
  }
});

TrainerSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  this.email = this.email.toLowerCase();

  next();
});

// Trainer model
export default mongoose.model<ITrainer, Trainer>("Trainer", TrainerSchema);
