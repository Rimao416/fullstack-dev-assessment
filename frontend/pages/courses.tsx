import {
  useGetCoursesQuery,
  useDeleteCourseMutation,
  useGetStatsQuery,
} from "@/slice/courseSlice";
import Header from "../components/Header";
import LoaderTable from "../components/LoaderTable";
import Link from "next/link";
import { format } from "date-fns";
import { useMessages } from "@/context/useMessage";
import NotFound from "@/components/NotFound";

export default function Courses() {
  const { data: courses, error, isLoading, refetch } = useGetCoursesQuery();
  const { refetch: statRefetch } = useGetStatsQuery();
  const { setMessage } = useMessages();
  const [deleteCourse] = useDeleteCourseMutation();

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id).unwrap();
        await refetch();
        statRefetch();
        setMessage("The course has been successfully deleted.", "success");
      } catch (error) {
        setMessage("An error occurred while deleting the trainer.", "error");
      }
    }
  };

  if (error) {
    let errorMessage = "An unknown error occurred";
    if ("status" in error) {
      errorMessage = `Error ${error.status}: ${JSON.stringify(error.data)}`;
    } else if ("message" in error) {
      console.log("An unknown error occurred",errorMessage);
    }
    return <NotFound/>;
  }

  return (
    <div>
      <Header />
      <main className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-8 text-white">Courses</h1>
        <Link
          href="/courses/new"
          className="bg-green-500 text-white px-4 py-2 rounded mb-4"
        >
          Create Course
        </Link>
        {isLoading ? (
          <LoaderTable />
        ) : (
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 border-b">Course Name</th>
                <th className="py-3 px-4 border-b">Date</th>
                <th className="py-3 px-4 border-b">Subject</th>
                <th className="py-3 px-4 border-b">Location</th>
                <th className="py-3 px-4 border-b">Trainer</th>
                <th className="py-3 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((course, index) => (
                <tr key={index}>
                  <td className="py-3 px-4 border-b">{course.name}</td>
                  <td className="py-3 px-4 border-b">
                    {format(new Date(course.date), "yyyy-MM-dd")}
                  </td>
                  <td className="py-3 px-4 border-b">{course.subject}</td>
                  <td className="py-3 px-4 border-b">{course.location}</td>
                  <td className="py-3 px-4 border-b">
                    {course.trainer ? (
                      <div>
                        <strong>{course.trainer.name}</strong>
                      </div>
                    ) : (
                      <span>No trainer assigned</span>
                    )}
                  </td>
                  <td className="py-3 px-4 border-b flex space-x-2">
                    <Link href={`/courses/edit/${course.id}`}>
                      <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600"
                    >
                      Delete
                    </button>
                    <Link href={`/courses/assign/${course.id}`}>
                      <button className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600">
                        Assign Trainer
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}
