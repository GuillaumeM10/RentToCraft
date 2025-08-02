"use client";
import { type FileDto, type RentalDto } from "@rent-to-craft/dtos";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";

import AppService from "@/app/services/app.service";
import RentalService from "@/app/services/rental.service";

type RentalPageProps = {
  readonly params: Promise<{
    id: string;
  }>;
};
const RentalPage = ({ params }: RentalPageProps) => {
  const { id } = use(params);

  const [rental, setRental] = useState<RentalDto | null>(null);

  useEffect(() => {
    const fetchRental = async () => {
      try {
        const response = await RentalService.getOne(id);

        if (!response) {
          throw new Error("Rental not found");
        }

        setRental(response);
      } catch (error) {
        console.error("Error fetching rental:", error);
      }
    };

    void fetchRental();
  }, [id]);

  useEffect(() => {
    console.log("Rental:", rental);
  }, [rental]);

  return (
    <div className="layout-maxed mt-30">
      <Link href={`/rental`} className="btn btn-underline-primary w-fit mb-30">
        Objets
      </Link>
      {rental && (
        <div>
          <div className="top-profile">
            <img
              src={
                rental.images[0]
                  ? AppService.createImageUrl(rental.images[0] as FileDto)
                  : "https://images-ext-1.discordapp.net/external/rz9ILA7keWFyHgDlp2bRybCdRx2mWg1R4sYXG7Gntmw/https/picsum.photos/1280/720?format=webp&width=1600&height=900"
              }
              alt=""
              className="banner"
            />
            <img
              src={
                rental?.user?.profilePicture
                  ? AppService.createImageUrl(
                      rental.user.profilePicture as FileDto,
                    )
                  : "/images/default-pp.png"
              }
              alt="Profile"
              className="pp"
            />
          </div>
          <h1 className="text-2xl font-bold tac my-30">{rental.name}</h1>
          <p>id : {rental.id}</p>
          {rental.cats && (
            <p>Catégorie : {rental.cats.map((cat) => cat.name).join(", ")}</p>
          )}
          <p>Description : {rental.description}</p>
          <p>quantité : {rental.quantity} €</p>
        </div>
      )}
    </div>
  );
};

export default RentalPage;
