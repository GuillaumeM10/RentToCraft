"use client";

import { type CityDto, type UserDto } from "@rent-to-craft/dtos";
import { useState } from "react";

import UserService from "@/app/services/user.service";

import CityAutocomplete from "../../CityAutoComplete";
import { LoadingSpinner } from "../../LoadingSpinner";

interface UpdateUserProps {
  readonly userId: number;
  readonly initData?: Partial<UserDto> | null;
  readonly onSuccess?: () => void;
}

const UpdateUser = ({ userId, onSuccess, initData }: UpdateUserProps) => {
  const [email, setEmail] = useState(initData?.email ?? "");
  const [firstName, setFirstName] = useState(initData?.firstName ?? "");
  const [lastName, setLastName] = useState(initData?.lastName ?? "");
  const [description, setDescription] = useState(initData?.description ?? "");
  const [city, setCity] = useState<CityDto | null>(initData?.city ?? null);
  const [isPublic, setIsPublic] = useState(initData?.isPublic ?? false);
  const [address, setAddress] = useState(initData?.address ?? "");
  const [phone, setPhone] = useState(initData?.phone ?? "");
  const [contactEmail, setContactEmail] = useState(
    initData?.contactEmail ?? "",
  );
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (element: React.FormEvent) => {
    element.preventDefault();
    setError("");
    setIsLoading(true);

    const updateUser: Partial<UserDto> = {};

    if (email) updateUser.email = email;
    if (firstName) updateUser.firstName = firstName;
    if (lastName) updateUser.lastName = lastName;
    if (address) updateUser.address = address;
    if (phone) updateUser.phone = phone;
    if (contactEmail) updateUser.contactEmail = contactEmail;
    if (description) updateUser.description = description;
    if (city) updateUser.city = city;

    try {
      await UserService.update(+userId, {
        ...updateUser,
        isPublic,
      });
    } catch (thisError) {
      setError(
        thisError instanceof Error ? thisError.message : "Erreur de connexion",
      );
    } finally {
      setIsLoading(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group ">
        <label className="form-label" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          defaultValue={initData?.email ?? email}
          onChange={(thisError) => setEmail(thisError.target.value)}
          className="form-input "
        />
      </div>

      <div className="form-group ">
        <label className="form-label" htmlFor="contactEmail">
          Email de contact
        </label>
        <input
          id="contactEmail"
          type="email"
          defaultValue={initData?.contactEmail ?? contactEmail}
          onChange={(thisError) => setContactEmail(thisError.target.value)}
          className="form-input "
        />
      </div>

      <div className="md:grid grid-cols-2 gap-10">
        <div className="form-group ">
          <label className="form-label" htmlFor="firstName">
            Prénom
          </label>
          <input
            id="firstName"
            type="text"
            defaultValue={initData?.firstName ?? firstName}
            onChange={(thisError) => setFirstName(thisError.target.value)}
            className="form-input "
          />
        </div>

        <div className="form-group ">
          <label className="form-label" htmlFor="lastName">
            Nom
          </label>
          <input
            id="lastName"
            type="text"
            defaultValue={initData?.lastName ?? lastName}
            onChange={(thisError) => setLastName(thisError.target.value)}
            className="form-input "
          />
        </div>
      </div>

      <div className="form-group ">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          defaultValue={initData?.description ?? description}
          onChange={(thisError) => setDescription(thisError.target.value)}
          className="form-input "
        />
      </div>

      <div className="form-group ">
        <label className="form-label" htmlFor="address">
          Adresse
        </label>
        <input
          id="address"
          type="text"
          defaultValue={initData?.address ?? address}
          onChange={(thisError) => setAddress(thisError.target.value)}
          className="form-input "
        />
      </div>

      <div className="form-group ">
        <label className="form-label" htmlFor="city">
          Ville
        </label>
        <CityAutocomplete
          onChange={(changedCity) => setCity(changedCity)}
          defaultValue={initData?.city ?? city}
        />
      </div>

      <div className="form-group ">
        <label className="form-label" htmlFor="phone">
          Téléphone
        </label>
        <input
          id="phone"
          type="tel"
          defaultValue={initData?.phone ?? phone}
          onChange={(thisError) => setPhone(thisError.target.value)}
          className="form-input "
        />
      </div>

      <div className="form-group ">
        <label className="form-label" htmlFor="isPublic">
          Profil public (cocher pour rendre public)
        </label>
        <input
          id="isPublic"
          type="checkbox"
          defaultChecked={initData?.isPublic}
          onChange={(thisError) => setIsPublic(thisError.target.checked)}
          className="form-checkbox "
        />
        <span className="ml-10">Rendre mon profil public</span>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="btn btn--primary w-full mb-lg">
        {isLoading ? <LoadingSpinner size="small" light /> : "Envoyer"}
      </button>
    </form>
  );
};

export default UpdateUser;
