"use client";
import { type RentalDto } from "@rent-to-craft/dtos";
import React, { useEffect, useState } from "react";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import RentalService from "@/app/services/rental.service";

import RentalCard from "../Cards/RentalCard";

const SwiperRentals = () => {
  const [rentals, setRentals] = useState<RentalDto[]>([]);

  const getRentals = async () => {
    const response = await RentalService.getAll();
    setRentals(response);
  };

  useEffect(() => {
    void getRentals();
  }, []);

  if (rentals.length === 0) {
    return (
      <div className="text-center my-20">
        Aucun objet disponible pour le moment.
      </div>
    );
  }

  return (
    <div className="swiper-rentals">
      <h2 className="text-30  my-30">Les objets disponibles</h2>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1.5}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: {
            slidesPerView: 2.5,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3.5,
            spaceBetween: 30,
          },
        }}
        className="rental-swiper"
      >
        {rentals.map((rental, index) => {
          if (index >= 8) return null;
          return (
            <SwiperSlide key={rental.id}>
              <RentalCard rental={rental} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default SwiperRentals;
