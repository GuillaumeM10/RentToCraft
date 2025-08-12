"use client";
import {
  type CreateRentalDto,
  type RentalCatDto,
  type RentalDto,
} from "@rent-to-craft/dtos";
import { useEffect, useRef, useState } from "react";

import RentalService from "@/app/services/rental.service";

type CreateRentalProps = {
  readonly onSuccess?: (rental: RentalDto) => void;
};

const CreateRental = ({ onSuccess }: CreateRentalProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState<File[]>([]);
  const [cats, setCats] = useState<number[] | null>(null);
  const [existingCats, setExistingCats] = useState<RentalCatDto[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (element: React.FormEvent) => {
    element.preventDefault();
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
    };
    const createdRental = await RentalService.create(rentalData, images);
    if (onSuccess) {
      onSuccess(createdRental);
    }
  };

  const fetchCategories = async () => {
    const categories = await RentalService.getAllCategories();
    setExistingCats(categories);
  };

  useEffect(() => {
    void fetchCategories();
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
          value={name}
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
          value={description}
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
          value={quantity}
          onChange={(element) => setQuantity(Number(element.target.value))}
          className="form-input"
          min={1}
        />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="images">
          Images
        </label>
        <input
          id="images"
          type="file"
          ref={fileInputRef}
          multiple
          onChange={(element) =>
            setImages(Array.from(element.target.files ?? []))
          }
          className="form-input"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-outline-primary mt-10"
        >
          Choisir des images
        </button>

        {images.length > 0 && (
          <div className="mt-10">
            <h3>Images sélectionnées :</h3>
            <ul>
              {images.map((file, index) => (
                <>
                  <li key={file.name}>
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Image ${index + 1}`}
                      className="img-preview"
                      width={70}
                    />
                    {file.name}
                  </li>

                  <button
                    type="button"
                    onClick={() =>
                      setImages((previous) =>
                        previous.filter(
                          (_, imageIndex) => imageIndex !== index,
                        ),
                      )
                    }
                    className="btn btn-red mt-5"
                  >
                    Supprimer
                  </button>
                </>
              ))}
            </ul>
          </div>
        )}
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
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ),
          )}
        </select>
      </div>
      <button type="submit" className="btn btn-primary">
        Créer l'objet
      </button>
    </form>
  );
};

export default CreateRental;
