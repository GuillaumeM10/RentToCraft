"use client";

import { type RentalDto } from "@rent-to-craft/dtos";
import { useEffect, useState } from "react";

import RentalCard from "../components/Cards/RentalCard";
import RentalService from "../services/rental.service";

const RentalListPage = () => {
  const [rentals, setRentals] = useState<RentalDto[]>([]);

  const getRentals = async () => {
    const response = await RentalService.getAll();
    setRentals(response);
  };

  useEffect(() => {
    void getRentals();
  }, []);

  return (
    <div className="layout-maxed mt-30">
      <h1>Liste des objets</h1>
      <div className="grid grid-cols-3 gap-30">
        {rentals.map((rental) => (
          <RentalCard key={rental.id} rental={rental} />
        ))}
      </div>
    </div>
  );
};

export default RentalListPage;
