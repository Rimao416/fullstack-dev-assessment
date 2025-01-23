import CourseForm from "@/components/CourseForm";
import Header from "@/components/Header";
import { useRouter } from "next/router";
import {
  useGetCourseByIdQuery,
  useUpdateCourseMutation,
} from "@/slice/courseSlice";
import NotFound from "@/components/NotFound";

function EditCoursePage() {
  const router = useRouter();
  const { id } = router.query;

  // Load course data
  const { data: course, isLoading } = useGetCourseByIdQuery(id as string, {
    skip: !id,
  });

  // Mutation to update the course
  const [updateCourse] = useUpdateCourseMutation();

  // Handler to submit updated data
  const handleUpdateCourse = async (
    data: Omit<typeof course, "id" | "trainer">
  ) => {
    try {
      await updateCourse({ id: id as string, ...data }).unwrap();
    } catch (err) {
      console.error("Error updating course:", err);
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (!course) return <NotFound />;

  // Map default values for the form
  const defaultValues = {
    name: course.name,
    date: course.date,
    subject: course.subject,
    location: course.location,
    participants: course.participants,
    price: course.price,
    trainerPrice: course.trainer_price,
    notes: course.notes,
  };

  return (
    <div className="container mx-auto p-6">
      <Header />
      <h1 className="text-4xl font-bold mb-8 text-white">Edit Course</h1>
      <CourseForm
        onSubmit={handleUpdateCourse}
        mode="edit"
        defaultValues={defaultValues} // Pre-fill the form
      />
    </div>
  );
}

export default EditCoursePage;
