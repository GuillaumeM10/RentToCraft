"use client";

import { type RentalCatDto } from "@rent-to-craft/dtos";
import React, { useEffect, useState } from "react";

import CreateRentalCat from "@/app/components/Forms/Rental/CreateRentalCat";
import EditRentalCat from "@/app/components/Forms/Rental/EditRentalCat";
import OffCanvas from "@/app/components/OffCanvas";
import { ProtectedRoute } from "@/app/components/ProtectedRoute";
import RentalService from "@/app/services/rental.service";

const RentalCategories = () => {
  const [categories, setCategories] = useState<RentalCatDto[]>([]);

  const getCategories = async () => {
    try {
      const response = await RentalService.getAllCategories();
      setCategories(response);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    void getCategories();
  }, []);

  return (
    <ProtectedRoute onlyAdmin>
      <div>
        <h1>Catégories de locations</h1>
        <CreateRentalCat onSuccess={getCategories} />

        <h2 className="tac text-30 my-30">Liste des catégories</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id}>
                <td>{category.id}</td>
                <td>{category.name}</td>
                <td>{category.description}</td>
                <td className="tac">
                  <OffCanvas
                    buttonContent="Modifier"
                    buttonClassName="btn btn-underline-primary"
                  >
                    <EditRentalCat
                      categorie={category}
                      onSuccess={getCategories}
                    />
                  </OffCanvas>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
};

export default RentalCategories;
