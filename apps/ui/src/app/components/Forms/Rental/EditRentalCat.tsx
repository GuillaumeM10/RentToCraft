import { type RentalCatDto } from "@rent-to-craft/dtos";
import { useState } from "react";

import RentalService from "@/app/services/rental.service";

type EditRentalCatProps = {
  readonly onSuccess?: (category: RentalCatDto) => void;
  readonly categorie: RentalCatDto;
};

const EditRentalCat = ({ onSuccess, categorie }: EditRentalCatProps) => {
  const [name, setName] = useState(categorie.name);
  const [description, setDescription] = useState(categorie.description);

  const handleSubmit = async (element: React.FormEvent) => {
    element.preventDefault();
    try {
      if (!categorie?.id) return;
      const updatedCategory = await RentalService.updateCategory(
        categorie.id.toString(),
        {
          name,
          description,
        } as RentalCatDto,
      );
      if (onSuccess) {
        onSuccess(updatedCategory);
      }
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (!categorie?.id) return;
      await RentalService.deleteCategory(categorie.id.toString());
      if (onSuccess) {
        onSuccess(categorie);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          defaultValue={categorie.name}
          className="form-input"
          onChange={(element) => setName(element.target.value)}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          defaultValue={categorie.description ?? ""}
          onChange={(element) => setDescription(element.target.value)}
          className="form-input"
        />
      </div>

      <button
        type="button"
        className="btn btn-red mb-24"
        onClick={handleDelete}
      >
        Supprimer la catégorie
      </button>
      <button type="submit" className="btn btn-primary">
        Modifier la catégorie
      </button>
    </form>
  );
};

export default EditRentalCat;
