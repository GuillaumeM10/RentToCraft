"use client";

import {
  type CreateRentalDto,
  type RentalCatDto,
  type RentalDto,
} from "@rent-to-craft/dtos";
import { useEffect, useState } from "react";

import RentalService from "@/app/services/rental.service";

type EditRentalProps = {
  readonly onSuccess?: (rental: RentalDto) => void;
  readonly rental: RentalDto;
};

const EditRental = ({ onSuccess, rental }: EditRentalProps) => {
  const [name, setName] = useState(rental.name);
  const [description, setDescription] = useState(rental.description);
  const [quantity, setQuantity] = useState(rental.quantity);
  const [cats, setCats] = useState<number[] | null>(null);
  const [existingCats, setExistingCats] = useState<RentalCatDto[]>([]);
  const [price, setPrice] = useState<number>(rental.price ?? 0);
  const [startAvailable, setStartAvailable] = useState<Date>(
    new Date(rental.startAvailable ?? new Date()),
  );
  const [endAvailable, setEndAvailable] = useState<Date>(
    new Date(rental.endAvailable ?? new Date()),
  );

  const handleSubmit = async (element: React.FormEvent) => {
    element.preventDefault();

    if (!rental.id) return;
    const catsId = cats
      ? existingCats
          .filter((cat) => cats.includes(cat.id!))
          .map((cat) => cat.id!)
      : null;

    const rentalData: Partial<CreateRentalDto> = {
      name,
      description,
      quantity,
      cats: catsId ?? null,
      price,
      startAvailable,
      endAvailable,
    };
    const updateRental = await RentalService.update(rentalData, rental.id);

    if (onSuccess) {
      onSuccess(updateRental);
    }
  };

  const handleDelete = async () => {
    try {
      if (!rental.id) return;
      await RentalService.remove(rental.id);
      if (onSuccess) {
        onSuccess(rental);
      }
    } catch (error) {
      console.error("Error deleting rental:", error);
    }
  };

  const handleDateChange = (
    element: React.ChangeEvent<HTMLInputElement>,
    type: "end" | "start",
  ) => {
    const date = new Date(element.target.value);

    if (type === "start") {
      if (date.getTime() < Date.now()) {
        setStartAvailable(new Date());
      } else if (date.getTime() >= endAvailable.getTime()) {
        setStartAvailable(date);
        setEndAvailable(date);
      } else {
        setStartAvailable(date);
      }
    }

    if (type === "end") {
      if (date.getTime() <= startAvailable.getTime()) {
        setEndAvailable(startAvailable);
      } else {
        setEndAvailable(date);
      }
    }
  };

  const fetchCategories = async () => {
    const categories = await RentalService.getAllCategories();
    setExistingCats(categories);
  };

  useEffect(() => {
    void fetchCategories();
    if (rental.cats) {
      setCats(rental.cats.map((cat) => cat.id!));
    }
  }, []);

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="name">
          Nom
        </label>
        <input
          id="name"
          type="text"
          defaultValue={name}
          onChange={(element) => setName(element.target.value)}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          defaultValue={description ?? ""}
          onChange={(element) => setDescription(element.target.value)}
          className="form-input"
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="quantity">
          Quantité
        </label>
        <input
          id="quantity"
          type="number"
          defaultValue={quantity}
          onChange={(element) => setQuantity(Number(element.target.value))}
          className="form-input"
          required
        />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="price">
          Prix
        </label>
        <input
          id="price"
          type="number"
          defaultValue={price}
          onChange={(element) => setPrice(Number(element.target.value))}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="startAvailable">
          Date de début de disponibilité
        </label>
        <input
          id="startAvailable"
          type="date"
          value={startAvailable.toISOString().split("T")[0]}
          min={new Date().toISOString().split("T")[0]}
          onChange={(element) => handleDateChange(element, "start")}
          className="form-input"
          required
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="endAvailable">
          Date de fin de disponibilité
        </label>
        <input
          id="endAvailable"
          type="date"
          value={endAvailable.toISOString().split("T")[0]}
          min={startAvailable.toISOString().split("T")[0]}
          onChange={(element) => handleDateChange(element, "end")}
          className="form-input"
          required
        />
        <p className="form-input-hint">
          La date de fin de disponibilité doit être après la date de début de
          disponibilité.
        </p>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="cats">
          Catégories
        </label>
        <select
          id="cats"
          multiple
          onChange={(element) =>
            setCats(
              Array.from(element.target.selectedOptions, (option) =>
                Number(option.value),
              ),
            )
          }
          className="form-input"
        >
          {existingCats.map(
            (cat) =>
              cat.id && (
                <option
                  key={cat.id}
                  value={cat.id}
                  selected={cats?.includes(cat.id) ?? false}
                >
                  {cat.name}
                </option>
              ),
          )}
        </select>
      </div>

      <button type="button" className="btn btn-red" onClick={handleDelete}>
        Supprimer l'objet
      </button>

      <button type="submit" className="btn btn-primary">
        Mettre à jour l'objet
      </button>
    </form>
  );
};

export default EditRental;
