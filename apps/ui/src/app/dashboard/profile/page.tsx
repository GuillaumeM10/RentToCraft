"use client";
import UpdateUser from "@/app/components/Forms/User/UpdateUser";
import OffCanvas from "@/app/components/OffCanvas";
import { useAuth } from "@/app/contexts/auth.context";
import AppService from "@/app/services/app.service";
import UserService from "@/app/services/user.service";
import { UserDto } from "@rent-to-craft/dtos";
import React, { useEffect, useState } from "react";

const Profile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserDto | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(
    null,
  );
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const getUserProfile = async () => {
    if (!user || !user.id) return;

    const fetchedUserProfile = await UserService.getOne(user.id);
    setUserProfile(fetchedUserProfile);

    if (!fetchedUserProfile) {
      console.error("User profile not found");
      return;
    }

    if (
      fetchedUserProfile.profilePicture &&
      "id" in fetchedUserProfile.profilePicture
    ) {
      const imageUrl = AppService.createImageUrl(
        fetchedUserProfile.profilePicture,
      );
      setProfilePictureUrl(imageUrl);
    }

    if (fetchedUserProfile.banner && "id" in fetchedUserProfile.banner) {
      const bannerImageUrl = AppService.createImageUrl(
        fetchedUserProfile.banner,
      );
      setBannerUrl(bannerImageUrl);
    }
  };

  useEffect(() => {
    void getUserProfile();
  }, [user]);

  useEffect(() => {
    return () => {
      if (profilePictureUrl && profilePictureUrl.startsWith("blob:")) {
        URL.revokeObjectURL(profilePictureUrl);
      }
    };
  }, [profilePictureUrl]);

  return (
    <div>
      <h1>Mon profil</h1>

      {user && user.id && (
        <OffCanvas
          autoCloseOnClick={true}
          buttonContent="Modifier mon profil"
          buttonClassName="btn btn-primary mb-30"
        >
          <UpdateUser userId={user?.id} userIsPublic={userProfile?.isPublic} />
        </OffCanvas>
      )}

      {bannerUrl && (
        <img
          src={bannerUrl}
          alt="Banner"
          width={600}
          height={200}
          className="banner"
        />
      )}

      <div className="user">
        {userProfile && (
          <>
            {profilePictureUrl && (
              <img
                src={profilePictureUrl}
                alt="Profile"
                width={100}
                height={100}
                className="pp"
              />
            )}
            <h2>
              Bonjour,
              {userProfile.firstName || userProfile.lastName
                ? `${userProfile.firstName} ${userProfile.lastName}`
                : "utilisateur"}
            </h2>
            <p className="email">Email: {userProfile.email}</p>
            <p className="description">
              {userProfile.description || "Aucune description fournie."}
            </p>
            <p className="role">Role: {userProfile.role}</p>
            <p className="address">
              Adresse: {userProfile.address || "Aucune adresse fournie."}
            </p>
            <p className="city">
              Ville: {userProfile.city?.name || "Aucune ville fournie."}
            </p>
            <p className="phone">
              Téléphone:{" "}
              {userProfile.phone || "Aucun numéro de téléphone fourni."}
            </p>
            <p className="contact-email">
              Email de contact:{" "}
              {userProfile.contactEmail || "Aucun email de contact fourni."}
            </p>
            <p className="is-profile-public">
              Votre profile est: {userProfile.isPublic ? "public" : "privé"}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
