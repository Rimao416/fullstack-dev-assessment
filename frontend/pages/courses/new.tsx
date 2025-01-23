import CourseForm from "@/components/CourseForm";
import Header from "@/components/Header";
import { useAddCourseMutation } from "@/slice/courseSlice";

function New() {
  const [addCourse] = useAddCourseMutation();

  const handleAddCourse = async (data: Parameters<typeof addCourse>[0]) => {
    await addCourse(data).unwrap();
  };

  return (
    <div className="container mx-auto p-6">
      <Header />
      <h1 className="text-4xl font-bold mb-8 text-white">New Course</h1>
      <CourseForm onSubmit={handleAddCourse} mode="add" />
    </div>
  );
}

export default New;
