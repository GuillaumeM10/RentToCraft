"use client";
import {
  type FileDto,
  type RentalCommentDto,
  type RentalDto,
} from "@rent-to-craft/dtos";
import { Clipboard, Facebook, Twitter } from "lucide-react";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import Breadcrumb from "@/app/components/Breadcrumb";
import RentalComment from "@/app/components/Cards/RentalComment";
import CreateRentalCommnent from "@/app/components/Forms/Rental/CreateRentalCommnent";
import Img from "@/app/components/Img";
import MapLeaflet from "@/app/components/MapLeaflet";
import Landing from "@/app/components/Sections/Landing";
import AppService from "@/app/services/app.service";
import RentalService from "@/app/services/rental.service";

type RentalPageProps = {
  readonly params: Promise<{
    id: string;
  }>;
};
const RentalPage = ({ params }: RentalPageProps) => {
  const { id } = use(params);
  const [comments, setComments] = useState<RentalCommentDto[]>([]);

  const [rental, setRental] = useState<RentalDto | null>(null);

  const fetchComments = async () => {
    if (rental?.id) {
      const response = await RentalService.getCommentsByRental(rental.id);
      setComments(response);
    }
  };

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
    if (rental?.id) {
      void fetchComments();
    }
  }, [rental]);

  const handleShare = async (type?: string) => {
    switch (type) {
      case "default": {
        await navigator.share({
          title: rental?.name,
          text: rental?.description ?? rental?.name,
          url: window.location.href,
        });

        break;
      }
      case "facebook": {
        const shareUrl = new URL("https://www.facebook.com/sharer/sharer.php");
        shareUrl.searchParams.set("u", window.location.href);

        if (rental?.name) {
          shareUrl.searchParams.set("title", rental.name);
        }
        if (rental?.description) {
          shareUrl.searchParams.set("quote", rental.description);
          shareUrl.searchParams.set("description", rental.description);
        }

        window.open(shareUrl.toString(), "_blank");

        break;
      }
      case "twitter": {
        window.open(
          `https://x.com/intent/tweet?url=${window.location.href}`,
          "_blank",
        );

        break;
      }
      default: {
        await navigator.clipboard.writeText(window.location.href);
        break;
      }
    }
  };

  return (
    <div className="layout-maxed mt-30 single-rental-template">
      <Landing
        image={
          rental?.images[0]
            ? AppService.createImageUrl(rental?.images[0] as FileDto)
            : "https://images-ext-1.discordapp.net/external/rz9ILA7keWFyHgDlp2bRybCdRx2mWg1R4sYXG7Gntmw/https/picsum.photos/1280/720?format=webp&width=1600&height=900"
        }
        title={rental?.name}
        description={rental?.description ?? undefined}
        centered
      />

      <div className="flex justify-between gap-16 bread-share">
        <Breadcrumb />
        <div className="share-buttons flex justify-center lg:justify-end gap-4">
          <button className="" onClick={() => handleShare("facebook")}>
            <Facebook className="w-8 h-8" />
          </button>
          <button className="" onClick={() => handleShare("twitter")}>
            <Twitter className="w-8 h-8" />
          </button>
          <button className="" onClick={() => handleShare()}>
            <Clipboard className="w-8 h-8" />
          </button>
        </div>
      </div>

      {rental && (
        <div>
          <div className="top-profile">
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
            {rental.user.isPublic ? (
              <Link href={`/profile/${rental.user.id}`}>
                <p className="name mt-10">{rental.user.firstName}</p>
              </Link>
            ) : (
              <p className="name mt-10">{rental.user.firstName}</p>
            )}
          </div>

          <h1 className="text-2xl font-bold tac mb-30 mt-10">{rental.name}</h1>

          <div className="cats flex flex-wrap justify-center gap-10 mt-20 mb-30">
            {rental.cats?.map((cat) => (
              <Link
                key={cat.id}
                className="btn btn-primary btn-small"
                href={`/rental/categorie/${cat.slug}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          {rental.images.length > 1 && (
            <div className="images my-40 py-40 border-b-2 border-t-2 border-gray-300">
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={true}
                autoplay={{
                  delay: 2500,
                  disableOnInteraction: false,
                }}
                navigation={true}
                pagination={{
                  clickable: true,
                }}
                modules={[Autoplay, Navigation, Pagination]}
                className="mySwiper"
              >
                {rental.images.map((image) => (
                  <SwiperSlide key={image.name}>
                    <Img
                      image={image as FileDto}
                      className="w-full h-full contain"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          )}

          <div className="content">
            <p>Description</p>
            <p className="description mb-20 text-lg">{rental.description}</p>

            <table>
              <thead className="hidden">
                <tr>
                  <th>Propriété</th>
                  <th>Valeur</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Quantité disponibles</td>
                  <td>{rental.quantity}</td>
                </tr>
                <tr>
                  <td>Prix</td>
                  <td>12 €</td>
                </tr>
                <tr>
                  <td>Localisation</td>
                  <td>Paris</td>
                </tr>
              </tbody>
            </table>

            <div className="mt-20">
              <h3 className="text-lg font-semibold mb-10">Localisation</h3>
              <MapLeaflet
                latitude={rental.user.city?.latitude ?? 48.8566}
                longitude={rental.user.city?.longitude ?? 2.3522}
                height={300}
                zoom={12}
                className="rounded-lg shadow-md"
              />
            </div>
          </div>

          <h2 className="text-3xl comment-title w-100 pb-24 mb-24 mt-40 border-b-2 border-gray-300">
            Commentaires <span className="text-sm">({comments.length})</span>
          </h2>

          <CreateRentalCommnent
            rental={rental}
            onSuccess={() => {
              void fetchComments();
            }}
          />

          <div className="comments flex flex-col gap-40 mt-36">
            {comments.map((comment) => (
              <RentalComment
                key={comment.id}
                comment={comment}
                onRemove={() => {
                  void fetchComments();
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalPage;
