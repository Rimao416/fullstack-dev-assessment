import request from "supertest";
import app from "../index";
import courseModel from "../models/courseModel";
import trainerModel from "../models/trainerModel";

jest.mock("../models/courseModel");
jest.mock("../models/trainerModel");

describe("Course Controller", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("GET /api/v1/courses", () => {
    it("should fetch all courses", async () => {
      const mockCourses = [
        {
          _id: "1",
          name: "Course 1",
          trainer: { _id: "10", name: "Trainer 1" },
        },
        {
          _id: "2",
          name: "Course 2",
          trainer: { _id: "11", name: "Trainer 2" },
        },
      ];
      (courseModel.find as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCourses),
      });

      const res = await request(app).get("/api/v1/courses");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toEqual(mockCourses);
    });
  });

  describe("GET /api/v1/courses/:id", () => {
    it("should fetch a single course by ID", async () => {
      const mockCourse = {
        _id: "1",
        name: "Course 1",
        trainer: { _id: "10", name: "Trainer 1" },
      };
      (courseModel.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCourse),
      });

      const res = await request(app).get("/api/v1/courses/1");

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toEqual(mockCourse);
    });
  });

  describe("POST /api/v1/courses", () => {
    it("should create a new course", async () => {
      const newCourse = {
        name: "Course 1",
        date: "2025-01-20",
        location: "Room A",
      };
      (courseModel.findOne as jest.Mock).mockResolvedValue(null);
      (courseModel.create as jest.Mock).mockResolvedValue({
        _id: "1",
        ...newCourse,
      });

      const res = await request(app).post("/api/v1/courses").send(newCourse);

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toEqual({ _id: "1", ...newCourse });
    });
  });

  describe("PUT /api/v1/courses/:id", () => {
    it("should update an existing course", async () => {
      const updatedCourse = { name: "Updated Course" };
      (courseModel.findByIdAndUpdate as jest.Mock).mockResolvedValue({
        _id: "1",
        ...updatedCourse,
      });

      const res = await request(app).put("/api/v1/courses/1").send(updatedCourse);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data).toEqual({ _id: "1", ...updatedCourse });
    });
  });

  describe("DELETE /api/v1/courses/:id", () => {
    it("should delete a course", async () => {
      (courseModel.findByIdAndDelete as jest.Mock).mockResolvedValue({});

      const res = await request(app).delete("/api/v1/courses/1");

      expect(res.status).toBe(204);
      expect(res.body).toEqual({});
    });
  });

  describe("PUT /api/v1/courses/:id/assign-trainer", () => {
    it("should assign a trainer to a course", async () => {
      const mockCourse = {
        _id: "1",
        name: "Course 1",
        date: "2025-01-20",
        save: jest.fn(),
      };
      const mockTrainer = { _id: "10", email: "trainer@test.com" };

      (courseModel.findById as jest.Mock).mockResolvedValue(mockCourse);
      (trainerModel.findOne as jest.Mock).mockResolvedValue(mockTrainer);
      (courseModel.findOne as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .put("/api/v1/courses/1/assign-trainer")
        .send({ trainerEmail: "trainer@test.com" });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Trainer assigned successfully");
      expect(mockCourse.save).toHaveBeenCalled();
    });
  });
});
