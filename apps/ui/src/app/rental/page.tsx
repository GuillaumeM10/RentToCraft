"use client";

import { type RentalCatDto, type RentalDto } from "@rent-to-craft/dtos";
import Link from "next/link";
import { useEffect, useState } from "react";

import Breadcrumb from "../components/Breadcrumb";
import RentalCard from "../components/Cards/RentalCard";
import RentalService from "../services/rental.service";

const RentalListPage = () => {
  const [rentals, setRentals] = useState<RentalDto[]>([]);
  const [cats, setCats] = useState<RentalCatDto[]>([]);

  const getRentals = async () => {
    const response = await RentalService.getAll();
    setRentals(response);
  };

  const getCats = async () => {
    const response = await RentalService.getAllCategories();
    setCats(response);
  };

  useEffect(() => {
    void getRentals();
    void getCats();
  }, []);

  return (
    <div className="layout-maxed mt-30">
      <h1 className="text-3xl tac mt-32 mb-24">Objets disponibles</h1>

      <div className="mx-auto">
        <Breadcrumb />
      </div>

      <div className="cats flex flex-wrap gap-10 mt-20 mb-30">
        <Link className="btn btn-outline-primary btn-small" href="/rental">
          Toutes les catégories
        </Link>
        {cats.map((cat) => (
          <Link
            key={cat.id}
            className="btn btn-primary btn-small"
            href={`/rental/categorie/${cat.slug}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-30">
        {rentals.map((rental) => (
          <RentalCard key={rental.id} rental={rental} />
        ))}
      </div>
    </div>
  );
};

export default RentalListPage;
