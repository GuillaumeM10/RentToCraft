"use client";
import { type FileDto, type UserDto } from "@rent-to-craft/dtos";
import { useEffect, useRef, useState } from "react";

import AppService from "@/app/services/app.service";
import UserService from "@/app/services/user.service";

import { LoadingSpinner } from "../../LoadingSpinner";

interface UpdateUserFilesProps {
  readonly initData?: Partial<UserDto> | null;
  readonly onSuccess?: () => void;
}

const UpdateUserFiles = ({ onSuccess, initData }: UpdateUserFilesProps) => {
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [existingProfilePicture, setExistingProfilePicture] = useState<
    string | null
  >(null);
  const [existingBanner, setExistingBanner] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputProfilePictureRef = useRef<HTMLInputElement | null>(null);
  const inputBannerRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (
    element: React.FormEvent,
    type: "banner" | "profilePicture",
  ) => {
    element.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (type === "profilePicture" && profilePicture) {
        await UserService.uploadFile(type, profilePicture);
        setProfilePicture(null);
      } else if (type === "banner" && banner) {
        await UserService.uploadFile(type, banner);
        setBanner(null);
      }
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

  const handleDelete = async (type: "banner" | "profilePicture") => {
    setError("");
    setIsLoading(true);

    try {
      const result = await UserService.deleteFile(type);

      if (result === true) {
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setError(result as string);
      }
    } catch (thisError) {
      setError(
        thisError instanceof Error ? thisError.message : "Erreur de connexion",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initData?.profilePicture) {
      setExistingProfilePicture(
        AppService.createImageUrl(initData.profilePicture as FileDto),
      );
    }
    if (initData?.banner) {
      setExistingBanner(AppService.createImageUrl(initData.banner as FileDto));
    }
  }, [initData]);

  return (
    <>
      <form onSubmit={(element) => handleSubmit(element, "profilePicture")}>
        <div className="form-group ">
          <label className="form-label" htmlFor="profilePicture">
            Photo de profil
          </label>

          <input
            id="profilePicture"
            type="file"
            accept="image/*"
            ref={inputProfilePictureRef}
            onChange={(element) => {
              if (element.target.files) {
                const file = element.target.files[0];
                if (file) {
                  setProfilePicture(file);
                  setExistingProfilePicture(null);
                }
              }
            }}
            className="form-input "
          />

          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => inputProfilePictureRef.current?.click()}
          >
            Choisir un fichier
          </button>

          {profilePicture && (
            <div className="file-preview">
              <img
                src={URL.createObjectURL(profilePicture)}
                alt="Profile"
                width={100}
                height={100}
                className="pp"
              />
              <span>{profilePicture.name}</span>
              <button
                className="btn btn-red"
                type="button"
                onClick={() => setProfilePicture(null)}
              >
                Supprimer
              </button>
            </div>
          )}

          {existingProfilePicture && (
            <div className="file-preview">
              <img
                src={existingProfilePicture}
                alt="Existing Profile"
                width={100}
                height={100}
                className="pp"
              />
              <span>Image de profil existante</span>
              <button
                type="button"
                className="btn btn-red"
                onClick={async () => {
                  setExistingProfilePicture(null);
                  await handleDelete("profilePicture");
                }}
              >
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
      <form onSubmit={(element) => handleSubmit(element, "banner")}>
        <div className="form-group ">
          <label className="form-label" htmlFor="banner">
            Bannière
          </label>

          <input
            id="banner"
            type="file"
            accept="image/*"
            ref={inputBannerRef}
            onChange={(element) => {
              if (element.target.files) {
                const file = element.target.files[0];
                if (file) {
                  setBanner(file);
                  setExistingBanner(null);
                }
              }
            }}
            className="form-input "
          />

          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={() => inputBannerRef.current?.click()}
          >
            Choisir un fichier
          </button>

          {banner && (
            <div className="file-preview">
              <img
                src={URL.createObjectURL(banner)}
                alt="Banner"
                className="banner"
                width={100}
                height={100}
              />
              <span>{banner.name}</span>
              <button
                type="button"
                className="btn btn-red"
                onClick={() => setBanner(null)}
              >
                Supprimer
              </button>
            </div>
          )}

          {existingBanner && (
            <div className="file-preview">
              <img
                src={existingBanner}
                alt="Existing Banner"
                className="banner"
                width={100}
                height={100}
              />
              <span>Image de profil existante</span>
              <button
                type="button"
                className="btn btn-red"
                onClick={async () => {
                  setExistingBanner(null);
                  await handleDelete("banner");
                }}
              >
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
    </>
  );
};

export default UpdateUserFiles;
