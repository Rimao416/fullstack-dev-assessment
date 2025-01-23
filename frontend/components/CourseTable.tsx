import { ICourse } from "@/slice/courseSlice";

export default function CourseTable({ courses }: { courses: ICourse[] }) {
  return (
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
        {courses.map((course, index) => (
          <tr key={index}>
            <td className="py-3 px-4 border-b">{course.name}</td>
            {/* <td className="py-3 px-4 border-b">{course.date}</td> */}
            <td className="py-3 px-4 border-b">{course.subject}</td>
            <td className="py-3 px-4 border-b">{course.location}</td>
            {/* <td className="py-3 px-4 border-b">
                {course.trainer ? (
                  <div>
                    <strong>{course.trainer.name}</strong>
                    <div>{course.trainer.training_subjects.join(", ")}</div>
                    <div>{course.trainer.email}</div>
                  </div>
                ) : (
                  <span>No trainer assigned</span>
                )}
              </td> */}
            <td className="py-3 px-4 border-b flex space-x-2">
              <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-yellow-600">
                Edit
              </button>
              <button className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600">
                Delete
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
                Assign Trainer
              </button>
            </td>
            <td className="py-3 px-4 border-b"></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
