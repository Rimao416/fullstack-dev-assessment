import Header from "../components/Header";
import {
  useDeleteTrainerMutation,
  useGetTrainersQuery,
} from "@/slice/trainerSlice";
import LoaderTable from "@/components/LoaderTable";
import Link from "next/link";
import { useMessages } from "@/context/useMessage";
import { useGetStatsQuery } from "@/slice/courseSlice";
import NotFound from "@/components/NotFound";

export default function Trainers() {
  const { setMessage } = useMessages();
  const [deleteTrainer] = useDeleteTrainerMutation();
  const { data: trainers, error, isLoading, refetch } = useGetTrainersQuery();
  const { refetch: statRefetch } = useGetStatsQuery();

  if (error) {
    let errorMessage = "An unknown error occurred";

    if ("status" in error) {
      errorMessage = `Error ${error.status}: ${JSON.stringify(error.data)}`;
    } else if ("message" in error) {
      errorMessage = error.message || "An unknown error occurred";
    }

    setMessage(errorMessage, "error");

    return <NotFound />;
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trainer?"
    );
    if (!confirmed) return;

    try {
      await deleteTrainer(id).unwrap();
      await refetch();
      statRefetch();
      setMessage("The trainer has been successfully deleted.", "success");
    } catch (err) {
      setMessage("An error occurred while deleting the trainer.", "error");
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6 text-white">Trainers</h1>
        <Link
          href="/trainers/new"
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Create Trainer
        </Link>
        <div className="overflow-x-auto">
          {isLoading ? (
            <LoaderTable />
          ) : (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="w-full bg-gray-100 border-b">
                  <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                    Trainer Name
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                    Subjects
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                    Location
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                    Email
                  </th>
                  <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {trainers?.map((trainer, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{trainer.name}</td>
                    <td className="py-3 px-4">
                      {trainer.training_subjects.join(", ")}
                    </td>
                    <td className="py-3 px-4">{trainer.location}</td>
                    <td className="py-3 px-4">
                      <a
                        href={`mailto:${trainer.email}`}
                        className="text-blue-500 hover:underline"
                      >
                        {trainer.email}
                      </a>
                    </td>
                    <td className="py-3 px-4 flex space-x-2">
                      <Link href={`/trainers/edit/${trainer._id}`}>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded">
                          Edit
                        </button>
                      </Link>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded"
                        onClick={() => handleDelete(trainer._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
