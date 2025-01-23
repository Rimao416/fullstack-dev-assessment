import Header from "@/components/Header";
import TrainerForm from "@/components/TrainerForm";
import { useAddTrainerMutation } from "@/slice/trainerSlice";
function NewTrainer() {
  const [addTrainer] = useAddTrainerMutation();

  const handleAddTrainer = async (data: {
    name: string;
    location: string;
    email: string;
    training_subjects: { value: string }[]; // Ce que vous recevez
  }) => {
    // Adapter les données
    const payload = {
      ...data,
      training_subjects: data.training_subjects.map((subject) => subject.value), // Extraire les valeurs en tableau de strings
    };
      
      await addTrainer(payload).unwrap(); // Envoie les données au backend
      
 
  };

  return (
    <div className="container mx-auto p-6">
      <Header />
      <h1 className="text-4xl font-bold mb-8 text-white">New Trainer</h1>
      <TrainerForm onSubmit={handleAddTrainer} mode="add" />
    </div>
  );
}


export default NewTrainer;
