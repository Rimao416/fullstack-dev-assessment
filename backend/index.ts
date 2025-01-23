import express, { Application } from "express";
import AppError from "./utils/appError";
import courseRoutes from "./routes/courseRoutes";
import authRoutes from "./routes/authRoutes";
import trainerRoutes from "./routes/trainerRoutes"
import globalErrorHandler from "./controllers/errorController";
import cookieParser from "cookie-parser";
import "./models/courseModel";
import "./models/trainerModel";

const app: Application = express();
import cors from "cors";
// 1) MIDDLEWARE
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);
// app.use(cors());
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use("/api/v1/trainers", trainerRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/auth", authRoutes);

// Handle Errors

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});


app.use(globalErrorHandler);

// 4) SERVER

export default app;
 