"use client";

import { type CityDto, type RentalDto } from "@rent-to-craft/dtos";
import Link from "next/link";
import { use, useEffect, useState } from "react";

import Breadcrumb from "@/app/components/Breadcrumb";
import RentalCard from "@/app/components/Cards/RentalCard";
import CityAutocomplete from "@/app/components/CityAutoComplete";
import CityService from "@/app/services/city.service";
import RentalService from "@/app/services/rental.service";

type CityListSinglePageProps = {
  readonly params: Promise<{
    id: string;
  }>;
};

const CityListSinglePage = ({ params }: CityListSinglePageProps) => {
  const { id } = use(params);

  const [rentals, setRentals] = useState<RentalDto[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityDto | null>(null);
  const [city, setCity] = useState<CityDto | null>(null);

  const getCity = async () => {
    const response = await CityService.getOne(id);
    setCity(response.city);

    const rentalsData = await Promise.all(
      response.rentals.map((rentalId) => RentalService.getOne(rentalId)),
    );

    setRentals(
      rentalsData
        .filter((rental): rental is RentalDto => !!rental)
        .filter(
          (rental, index, self) =>
            self.findIndex((r) => r.id === rental.id) === index,
        ),
    );
  };

  useEffect(() => {
    void getCity();
  }, [id]);

  return (
    <div className="layout-maxed mt-30">
      <h1 className="text-3xl tac mt-32 mb-24">
        Objets disponibles à {city?.name}
      </h1>

      <div className="mx-auto">
        <Breadcrumb />
      </div>

      <div className="flex justify-center mb-24">
        <CityAutocomplete
          onChange={(changedCity) => {
            setSelectedCity(changedCity);
          }}
        />
        <Link
          href={`/rental/city/${selectedCity?.id}`}
          className="btn btn-underline-primary ml-10"
          style={{
            paddingTop: "0",
            ...(!selectedCity && {
              opacity: 0.5,
              pointerEvents: "none",
            }),
          }}
        >
          Rechercher
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-30">
        {rentals.length > 0 ? (
          rentals.map((rental) => (
            <RentalCard key={rental.id} rental={rental} />
          ))
        ) : (
          <div className="tac col-span-3 my-40">Aucun objet trouvé</div>
        )}
      </div>
    </div>
  );
};

export default CityListSinglePage;
