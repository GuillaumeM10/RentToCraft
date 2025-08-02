"use client";
import { type RentalCatDto, type RentalDto } from "@rent-to-craft/dtos";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";

import RentalCard from "@/app/components/Cards/RentalCard";
import RentalService from "@/app/services/rental.service";

type RentalCategoryPageProps = {
  readonly params: Promise<{
    categorieSlug: string;
  }>;
};

const RentalCategoryPage = ({ params }: RentalCategoryPageProps) => {
  const { categorieSlug } = use(params);
  const [category, setCategory] = useState<RentalCatDto | null>(null);
  const [cats, setCats] = useState<RentalCatDto[]>([]);
  const [rentals, setRentals] = useState<RentalDto[]>([]);

  const getCategory = async (): Promise<RentalCatDto | null> => {
    try {
      const response = await RentalService.getOneCategory(categorieSlug);
      if (response) {
        setCategory(response);
        if (response.rentals && response.rentals.length > 0) {
          await getRentals(
            response.rentals
              .map((rental) => rental.slug)
              .filter((slug): slug is string => slug != null),
          );
        }
      }
      return response;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const getCats = async () => {
    const response = await RentalService.getAllCategories();
    setCats(response);
  };

  const getRentals = async (slugs: string[]) => {
    const rentalPromises = slugs.map(async (slug) => {
      const rental = await RentalService.getOne(slug);
      return rental;
    });

    const fetchedRentals = await Promise.all(rentalPromises);
    const validRentals = fetchedRentals.filter(
      (rental): rental is RentalDto => rental !== null,
    );

    setRentals(validRentals);
  };

  useEffect(() => {
    void getCategory();
    void getCats();
  }, [categorieSlug]);

  return (
    <div className="layout-maxed mt-30">
      <h1 className="text-3xl tac">Objets {category?.name}</h1>

      {category?.description && (
        <p className="text-center mt-10 mb-20">{category.description}</p>
      )}

      <div className="cats flex flex-wrap gap-10 mt-20 mb-30">
        <Link className="btn btn-primary" href="/rental">
          Toutes les catégories
        </Link>
        {cats.map((cat) => (
          <Link
            key={cat.id}
            className={`btn  ${cat.slug === categorieSlug ? "btn-outline-primary" : "btn-primary"}`}
            href={`/rental/categorie/${cat.slug}`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-30">
        {rentals?.map((rental) => (
          <RentalCard key={rental.id} rental={rental} />
        ))}
      </div>
    </div>
  );
};

export default RentalCategoryPage;
