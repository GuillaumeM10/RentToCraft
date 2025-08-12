"use client";

import { type CityDto, type RentalDto } from "@rent-to-craft/dtos";
import Link from "next/link";
import { useEffect, useState } from "react";

import Breadcrumb from "@/app/components/Breadcrumb";
import RentalCard from "@/app/components/Cards/RentalCard";
import CityAutocomplete from "@/app/components/CityAutoComplete";
import RentalService from "@/app/services/rental.service";

const CityListPage = () => {
  const [rentals, setRentals] = useState<RentalDto[]>([]);
  const [city, setCity] = useState<CityDto | null>(null);

  const getRentals = async () => {
    const response = await RentalService.getAll();
    setRentals(response);
  };

  useEffect(() => {
    void getRentals();
  }, []);

  return (
    <div className="layout-maxed mt-30">
      <h1 className="text-3xl tac mt-32 mb-24">Objets disponibles</h1>

      <div className="mx-auto">
        <Breadcrumb />
      </div>

      <div className="flex justify-center mb-24">
        <CityAutocomplete
          onChange={(changedCity) => {
            setCity(changedCity);
          }}
        />
        <Link
          href={`/rental/city/${city?.id}`}
          className="btn btn-underline-primary ml-10"
          style={{
            paddingTop: "0",
            ...(!city && {
              opacity: 0.5,
              pointerEvents: "none",
            }),
          }}
        >
          Rechercher
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-30">
        {rentals.map((rental) => (
          <RentalCard key={rental.id} rental={rental} />
        ))}
      </div>
    </div>
  );
};

export default CityListPage;
