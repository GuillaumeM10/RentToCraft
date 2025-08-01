"use client";

import { type RentalCatDto } from "@rent-to-craft/dtos";
import { useState } from "react";

import RentalService from "@/app/services/rental.service";

type CreateRentalCatProps = {
  readonly onSuccess?: (category: RentalCatDto) => void;
};
const CreateRentalCat = ({ onSuccess }: CreateRentalCatProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (element: React.FormEvent) => {
    element.preventDefault();
    try {
      await RentalService.createCategory({
        name,
        description,
      } as RentalCatDto);
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      if (onSuccess) {
        onSuccess({ name, description } as RentalCatDto);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group ">
        <label className="form-label" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          onChange={(thisError) => setName(thisError.target.value)}
          className="form-input "
        />
      </div>
      <div className="form-group ">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <input
          id="description"
          type="text"
          onChange={(thisError) => setDescription(thisError.target.value)}
          className="form-input "
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Créer la catégorie
      </button>
    </form>
  );
};

export default CreateRentalCat;
