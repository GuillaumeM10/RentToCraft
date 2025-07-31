"use client";

import UserService from "@/app/services/user.service";
import { useEffect, useState } from "react";
import { LoadingSpinner } from "../../LoadingSpinner";
import { CityDto, UserDto } from "@rent-to-craft/dtos";

interface UpdateUserProps {
  userId: number;
  userIsPublic: boolean | undefined;
}

const UpdateUser = ({ userId, userIsPublic }: UpdateUserProps) => {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState<CityDto | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userIsPublic !== undefined) {
      setIsPublic(userIsPublic);
    }
  }, [userIsPublic]);

  useEffect(() => {
    console.log("isPublic", isPublic);
  }, [isPublic]);

  const handleSubmit = async (element: React.FormEvent) => {
    element.preventDefault();
    setError("");
    setIsLoading(true);

    const updateIUser: Partial<UserDto> = {};

    if (email) updateIUser.email = email;
    if (firstName) updateIUser.firstName = firstName;
    if (lastName) updateIUser.lastName = lastName;
    if (address) updateIUser.address = address;
    if (phone) updateIUser.phone = phone;
    if (contactEmail) updateIUser.contactEmail = contactEmail;
    if (description) updateIUser.description = description;
    if (city) updateIUser.city = city;
    if (profilePicture) updateIUser.profilePicture = profilePicture;
    if (banner) updateIUser.banner = banner;

    console.log("updateIUser", updateIUser);

    try {
      await UserService.update(+userId, {
        ...updateIUser,
        isPublic,
      });
    } catch (thisError) {
      setError(
        thisError instanceof Error ? thisError.message : "Erreur de connexion",
      );
    } finally {
      setIsLoading(false);
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
          value={email}
          onChange={(thisError) => setEmail(thisError.target.value)}
          className="form-input "
        />
      </div>

      <div className="form-group ">
        <label className="form-label" htmlFor="firstName">
          Prénom
        </label>
        <input
          id="firstName"
          type="text"
          value={firstName}
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
          value={lastName}
          onChange={(thisError) => setLastName(thisError.target.value)}
          className="form-input "
        />
      </div>

      <div className="form-group ">
        <label className="form-label" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={description}
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
          value={address}
          onChange={(thisError) => setAddress(thisError.target.value)}
          className="form-input "
        />
      </div>

      <div className="form-group ">
        <label className="form-label" htmlFor="phone">
          Téléphone
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(thisError) => setPhone(thisError.target.value)}
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
          value={contactEmail}
          onChange={(thisError) => setContactEmail(thisError.target.value)}
          className="form-input "
        />
      </div>

      {/* <div className="form-group ">
        <label className="form-label" htmlFor="city">
          Ville
        </label>
        <input
          id="city"
          type="text"
          value={city?.name || ""}
          onChange={(thisError) => setCity({ name: thisError.target.value })}
          className="form-input "
        />
      </div> */}

      <div className="form-group ">
        <label className="form-label" htmlFor="isPublic">
          Profil public (cocher pour rendre public)
        </label>
        <input
          id="isPublic"
          type="checkbox"
          checked={isPublic ?? false}
          onChange={(thisError) => setIsPublic(thisError.target.checked)}
          className="form-checkbox "
        />
        <span>Rendre mon profil public</span>
      </div>

      <div className="form-group ">
        <label className="form-label" htmlFor="profilePicture">
          Photo de profil
        </label>
        <input
          id="profilePicture"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              const file = e.target.files[0];
              if (file) {
                setProfilePicture(file);
              }
            }
          }}
          className="form-input "
        />

        {profilePicture && (
          <div className="file-preview">
            <img
              src={URL.createObjectURL(profilePicture)}
              alt="Profile"
              width={100}
              height={100}
            />
            <span>{profilePicture.name}</span>
            <button type="button" onClick={() => setProfilePicture(null)}>
              Supprimer
            </button>
          </div>
        )}
      </div>

      <div className="form-group ">
        <label className="form-label" htmlFor="banner">
          Bannière
        </label>
        <input
          id="banner"
          type="file"
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              const file = e.target.files[0];
              if (file) {
                setBanner(file);
              }
            }
          }}
          className="form-input "
        />

        {banner && (
          <div className="file-preview">
            <img
              src={URL.createObjectURL(banner)}
              alt="Banner"
              width={100}
              height={100}
            />
            <span>{banner.name}</span>
            <button type="button" onClick={() => setBanner(null)}>
              Supprimer
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" className="btn btn--primary w-full mb-lg">
        {isLoading ? <LoadingSpinner size="small" light /> : "Envoyer"}
      </button>
    </form>
  );
};

export default UpdateUser;
