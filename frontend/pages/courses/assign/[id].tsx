import { useRouter } from "next/router";
import { useState } from "react";
import {
  useGetCourseByIdQuery,
  useAssignTrainerMutation,
} from "@/slice/courseSlice";
import { format } from "date-fns";
import {
  useGetTrainersQuery,
  useSuggestTrainerQuery,
} from "@/slice/trainerSlice";
import { useMessages } from "@/context/useMessage";
import Header from "@/components/Header";
import NotFound from "@/components/NotFound";

export default function AssignTrainerPage() {
  const { setMessage } = useMessages();
  const router = useRouter();
  const { id } = router.query;

  const {
    data: course,
    isLoading,
    error,
    refetch: refetchCourse,
  } = useGetCourseByIdQuery(id as string, { skip: !id });
  const {
    data: trainers = [],
    isLoading: trainersLoading,
    refetch: refetchTrainers,
  } = useGetTrainersQuery();

  const [assignTrainer] = useAssignTrainerMutation();
  const [selectedTrainer, setSelectedTrainer] = useState<string>(
    course?.trainer?.email || ""
  );
  const { data: suggestedTrainer, refetch: refetchSuggestedTrainer } =
    useSuggestTrainerQuery(
      {
        courseSubject: course?.subject || "",
        courseDate: course?.date || "",
      },
      { skip: !course?.subject || !course?.date }
    );
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTrainer(event.target.value);
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAssignTrainer();
  };

  const handleAssignTrainer = async (trainerEmail = selectedTrainer) => {
    if (!trainerEmail) return;

    try {
      await assignTrainer({
        courseId: id as string,
        trainerEmail,
      }).unwrap();
      setMessage("Trainer assigned successfully", "success");
      await refetchCourse();
      await refetchTrainers();
      await refetchSuggestedTrainer();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setMessage(error.message, "error");
      } else if (
        typeof error === "object" &&
        error !== null &&
        "data" in error
      ) {
        setErrorMessage(
          (error as { data?: { message?: string } }).data?.message ||
            "An error occurred"
        );
        setMessage(
          (error as { data?: { message?: string } }).data?.message ||
            "An error occurred",
          "error"
        );
      } else {
        setErrorMessage("An unknown error occurred");
        setMessage("An unknown error occurred", "error");
      }
    }
  };


  const handleSuggestedTrainerClick = async () => {
    if (suggestedTrainer) {
      await handleAssignTrainer(suggestedTrainer.email);
    }
  };

  if (isLoading || trainersLoading) return <p>Loading...</p>;
  if (error) return <NotFound/>;

  return (
    <div>
      <Header/>
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-4">
        Assign a trainer to the course{" "}
        <span className="text-blue-400">{course?.name || "Not found"}</span>
      </h1>

      <div className="bg-gray-700 p-4 rounded-lg shadow-inner mb-6">
        <p className="text-gray-300 text-lg mb-2">
          <span className="font-semibold text-white">Date:</span>{" "}
          {course?.date ? format(new Date(course.date), "dd/MM/yyyy") : "Not set"}
        </p>
        <p className="text-gray-300 text-lg">
          <span className="font-semibold text-white">Subject:</span>{" "}
          {course?.subject || "Not set"}
        </p>
        <p className="text-gray-300 text-lg">
          <span className="font-semibold text-white">Trainer:</span>{" "}
          {course?.trainer?.name || "Not assigned"}
        </p>
      </div>

      {/* Trainer selection */}
      <form
        className="bg-gray-900 p-6 rounded-lg shadow-md"
        onSubmit={onSubmit}
      >
        <h2 className="text-xl font-semibold text-white mb-4">
          Assign Trainer
        </h2>

        <select
          value={selectedTrainer}
          onChange={handleSelectChange}
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
          required
        >
          {course?.trainer ? (
            <option value={course.trainer.email}>
              {course.trainer.name} (Current)
            </option>
          ) : (
            <option value="" disabled>
              Select a trainer
            </option>
          )}
          {trainers
            .filter((trainer) => trainer.email !== course?.trainer?.email)
            .map((trainer) => (
              <option key={trainer.email} value={trainer.email}>
                {trainer.name}
              </option>
            ))}
        </select>

        {errorMessage && <p className="text-red-500">{errorMessage}</p>}

        <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
          Assign Trainer
        </button>
      </form>
      {suggestedTrainer && (
        <form
          onSubmit={(e) => {
            e.preventDefault(); // Empêche le rechargement de la page
            handleSuggestedTrainerClick();
          }}
          className="mt-4 text-white"
        >
          <h3 className="text-lg mb-2">Suggested Trainer:</h3>
          <button
            type="submit" // Définit le bouton comme un bouton de soumission
            className="bg-green-500 hover:bg-green-600 text-white text-center font-semibold p-4 rounded-lg cursor-pointer inline-block w-full"
          >
            {suggestedTrainer.name}
          </button>
        </form>
      )}
      {!suggestedTrainer && (
        <p className="mt-4 text-white">
          No suggested trainer available.
        </p>
      )}
    </div>
    </div>
  );
}
