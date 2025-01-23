import Header from "@/components/Header";
import TrainerForm from "@/components/TrainerForm";
import { useRouter } from "next/router";
import { useGetSingleTrainerQuery, useUpdateTrainerMutation } from "@/slice/trainerSlice";
import React from "react";
import NotFound from "@/components/NotFound";

function EditTrainerPage() {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const { data: trainer, isLoading } = useGetSingleTrainerQuery(id as string ,{
    skip: !id
  }); // Récupère les données du formateur
  const [updateTrainer] = useUpdateTrainerMutation();

  const handleUpdateTrainer = async (data: Omit<typeof trainer, "id">) => {
    try {
      await updateTrainer({ id: id as string, ...data }).unwrap(); // Met à jour les données du formateur
      router.push("/"); // Redirection après mise à jour
    } catch (error) {
      console.error("Erreur lors de la mise à jour du formateur :", error);
      throw error; // Laisser le formulaire afficher un message d'erreur
    }
  };

  if (isLoading) {
    return <p>Chargement...</p>;
  }

  if (!trainer) {
    return <NotFound/>;
  }
  const defaultValues = {
    email: trainer.email,
    location:trainer.location,
    name: trainer.name,
    training_subjects: trainer.training_subjects.map((subject) => ({
      value: subject,
      label: subject,
    })),
  
  }

  return (
    <div className="container mx-auto p-6">
      <Header />
      <h1 className="text-4xl font-bold mb-8 text-white">Edit Trainer</h1>
      <TrainerForm
        onSubmit={handleUpdateTrainer}
        mode="edit"
        defaultValues={defaultValues} // Pré-remplit le formulaire
      />
    </div>
  );
}

export default EditTrainerPage;
