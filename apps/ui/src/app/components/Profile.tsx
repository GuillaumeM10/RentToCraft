import { type FileDto, type UserDto } from "@rent-to-craft/dtos";
import {
  Clipboard,
  Facebook,
  Mail,
  Map,
  MapPin,
  Phone,
  Twitter,
} from "lucide-react";
import React from "react";

import Img from "./Img";
import SwiperRentals from "./Sections/SwiperRentals";

type ProfileProps = {
  readonly user: UserDto;
  readonly fromDashboard?: boolean;
};

const Profile = ({ user, fromDashboard }: ProfileProps) => {
  const {
    firstName,
    lastName,
    email,
    description,
    address,
    city,
    phone,
    contactEmail,
    isPublic,
  } = user;

  const handleShare = async (type?: string) => {
    switch (type) {
      case "default": {
        await navigator.share({
          title:
            user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : "Utilisateur",
          text:
            user?.description ??
            (user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : "Utilisateur"),
          url: window.location.href,
        });

        break;
      }
      case "facebook": {
        const shareUrl = new URL("https://www.facebook.com/sharer/sharer.php");
        shareUrl.searchParams.set("u", window.location.href);

        if (user?.firstName && user?.lastName) {
          shareUrl.searchParams.set(
            "title",
            `${user.firstName} ${user.lastName}`,
          );
        }
        if (user?.description) {
          shareUrl.searchParams.set("quote", user.description);
          shareUrl.searchParams.set("description", user.description);
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
    <div>
      <div className="top-profile flex flex-col align-items- mt-16">
        <Img
          image={(user.banner as FileDto) ?? "/images/default-banner.jpg"}
          className="banner"
          alt="Banner"
          width={600}
          height={200}
        />

        <Img
          image={(user.profilePicture as FileDto) ?? "/images/default-pp.png"}
          className="pp"
          alt="Profile"
          width={100}
          height={100}
        />
        <p className="text-lg font-bold mt-14 capitalize">
          {(firstName ?? lastName) ? (
            <>
              {firstName} <span className="uppercase">{lastName}</span>
            </>
          ) : (
            "utilisateur"
          )}
        </p>
      </div>

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

      <div className="flex flex-col gap-4 my-40 border-b-2 border-t-2 border-gray-300 py-24">
        <h2 className="text-2xl font-bold m-0 tac">Me contacter</h2>
        <a
          href={`mailto:${contactEmail ?? email}`}
          className="email flex gap-4 items-center"
        >
          <Mail className="w-4 h-4" /> {contactEmail ?? email}
        </a>
        <a href={`tel:${phone}`} className="phone flex gap-4 items-center">
          <Phone className="w-4 h-4" />{" "}
          {phone ?? "Aucun numéro de téléphone fourni."}
        </a>
        <p className="address flex gap-4 items-center m-0">
          <MapPin className="w-4 h-4" /> {address ?? "Aucune adresse fournie."}
        </p>
        <p className="city flex gap-4 items-center m-0">
          <Map className="w-4 h-4" /> {city?.name ?? "Aucune ville fournie."}
        </p>
      </div>

      <p className="description">
        {description ?? "Aucune description fournie."}
      </p>

      {fromDashboard && (
        <p className="is-profile-public">
          Votre profile est: {isPublic ? "public" : "privé"}
        </p>
      )}

      <div className="mt-[100px]">
        <SwiperRentals userId={user.id ?? undefined} />
      </div>
    </div>
  );
};

export default Profile;
