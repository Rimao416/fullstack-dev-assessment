import mongoose from "mongoose";
import dotenv from "dotenv";
import Course from "../models/courseModel";
import { courses } from "./course";
import Trainer from "../models/trainerModel";
import { trainers } from "./trainer";

dotenv.config({ path: "./config.env" });

// const database: string = process.env.DATABASE_TEST ?? "";
// const databasePassword: string = process.env.DATABASE_PASSWORD ?? "";

const DB = process.env.DATABASE_TEST ?? "mongodb://mongodb:27017/test";
mongoose.connect(DB);
mongoose.set("strictQuery", true);
mongoose.connect(DB);

const createData = async () => {
  try {

    await Trainer.deleteMany({});
    await Course.deleteMany({});


     await Trainer.create(trainers);
    await Course.insertMany(courses);
    console.log("Data created")

  } catch (error) {
    console.error("ERROR WHEN CREATING DATA :", error);
  } finally {
    // Fermer la connexion MongoDB
    await mongoose.connection.close();
    process.exit();
  }
};

if (process.argv[2] === "--create-data") {
  createData();
}
