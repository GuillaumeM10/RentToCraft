"use client";
import { type RentalDto } from "@rent-to-craft/dtos";
import React, { useEffect, useState } from "react";

import RentalCard from "@/app/components/Cards/RentalCard";
import CreateRental from "@/app/components/Forms/Rental/CreateRental";
import RentalService from "@/app/services/rental.service";

const Tools = () => {
  const [rentals, setRentals] = useState<RentalDto[]>([]);

  const getRentals = async () => {
    const response = await RentalService.getAllByUser();
    setRentals(response);
  };

  useEffect(() => {
    void getRentals();
  }, []);

  return (
    <div>
      <h1>Mes objets</h1>

      <h2 className="text-30 tac my-30">Créer un objet</h2>

      <CreateRental onSuccess={() => getRentals()} />

      <h2 className="text-30 tac my-30">Mes objets</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-30">
        {rentals.map((rental) => (
          <RentalCard
            key={rental.id}
            rental={rental}
            editMode
            onSuccess={() => getRentals()}
          />
        ))}
      </div>
    </div>
  );
};

export default Tools;
