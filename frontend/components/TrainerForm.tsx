"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMessages } from "@/context/useMessage";
import { TrainerSchema } from "@/schemas";
import { useGetTrainersQuery } from "@/slice/trainerSlice";
import { useGetStatsQuery } from "@/slice/courseSlice";

// Type inference from the schema
type TrainerType = z.infer<typeof TrainerSchema>;

type TrainerFormProps = {
  mode: "add" | "edit";
  onSubmit: (data: TrainerType) => Promise<void>;
  defaultValues?: Partial<TrainerType>;
};

export default function TrainerForm({
  onSubmit,
  mode,
  defaultValues = {},
}: TrainerFormProps) {
  const { refetch } = useGetTrainersQuery();
  const { refetch: statRefetch } = useGetStatsQuery();
  const { setMessage } = useMessages();
  const {
    register,
    handleSubmit,
    trigger,
    control,
    formState: { errors },
  } = useForm<TrainerType>({
    resolver: zodResolver(TrainerSchema),
    defaultValues: {
      name: "",
      location: "",
      email: "",
      training_subjects: [{ value: "" }], // Initial empty subject
      ...defaultValues,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "training_subjects",
  });

  // Using the mutation to add a trainer

  const handleFormSubmit = async (data: TrainerType) => {
    try {
      const formattedData = {
        ...data,
      };

      // Call the onSubmit function with the formatted data
      await onSubmit(formattedData); // Calls the parent handler with the formatted data
      const successMessage =
        mode === "add"
          ? "Trainer added successfully"
          : "Trainer updated successfully";
      refetch();
      statRefetch();
      setMessage(successMessage, "success");
    } catch (err: unknown) {
      let errorMessage = "An error occurred.";

      if (
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof err.data === "object" &&
        err.data !== null &&
        "message" in err.data
      ) {
        errorMessage = String(
          (err as { data: { message: string } }).data.message
        );
      }

      setMessage(errorMessage, "error");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Trainer Form
      </h2>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            {...register("name")}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* Location Field */}
        <div>
          <label className="block text-gray-700 font-medium">Location</label>
          <input
            {...register("location")}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Berlin"
          />
          {errors.location && (
            <p className="text-red-500 text-sm">{errors.location.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-gray-700 font-medium">Email</label>
          <input
            {...register("email")}
            type="email"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john.doe@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Training Subjects */}
        <div>
          <label className="block text-gray-700 font-medium">
            Training Subjects
          </label>
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center space-x-2 mt-2">
              <div>
                <input
                  {...register(`training_subjects.${index}.value` as const)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Ex: React.js"
                />
              </div>
              {errors.training_subjects?.[index]?.value && (
                <p className="text-red-500 text-sm">
                  {errors.training_subjects[index].value.message}
                </p>
              )}
              <button
                type="button"
                onClick={() => {
                  if (fields.length > 1) {
                    remove(index);
                    trigger("training_subjects");
                  }
                }}
                className={`px-3 py-1 rounded-md ${
                  fields.length === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-500 text-white"
                }`}
                disabled={fields.length === 1}
              >
                ×
              </button>
            </div>
          ))}

          {errors.training_subjects && (
            <p className="text-red-500 text-sm">
              {errors.training_subjects.message}
            </p>
          )}
          <button
            type="button"
            onClick={() => append({ value: "" })}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add a Subject
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
        >
          {mode === "add" ? "Add Trainer" : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
