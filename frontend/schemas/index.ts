import * as z from "zod";

export const TrainerSchema = z.object({
    name: z.string().min(1, "Please enter a name"),
    location: z.string().min(1, "Please enter a location"),
    email: z.string().email("Please enter a valid email"),
    training_subjects: z
      .array(
        z.object({
          value: z.string().min(1, "Please enter a subject").trim(), // Validation pour chaque sujet
        })
        
      )
      .min(1, "Please select at least one subject")
      
  });
  
  export const CourseSchema = z.object({

      name: z.string().min(3, "Course name is required and must be at least 3 characters long."),
      date: z.string().regex(
        /^\d{4}-\d{2}-\d{2}$/, 
        "The date must be in the format YYYY-MM-DD"
      ),
      subject: z.string().min(3, "Course subject is required and must be at least 3 characters long."),
      location: z.string().min(3, "Location is required and must be at least 3 characters long."),
      participants: z.number().transform((val) => Number(val)), // Convertir en nombre
      notes: z.string().optional(),
      price: z.number().transform((val) => Number(val)), // Convertir en nombre
      trainer_price: z.number().transform((val) => Number(val)), // Convertir en nombre

  });