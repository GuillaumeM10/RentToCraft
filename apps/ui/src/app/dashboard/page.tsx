"use client";
import { type UserDto } from "@rent-to-craft/dtos";
import React, { useEffect, useState } from "react";

import UpdateUser from "@/app/components/Forms/User/UpdateUser";
import UpdateUserFiles from "@/app/components/Forms/User/UpdateUserFiles";
import OffCanvas from "@/app/components/OffCanvas";
import { useAuth } from "@/app/contexts/auth.context";
import UserService from "@/app/services/user.service";

import Profile from "../components/Profile";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserDto | null>(null);
  const router = useRouter();

  const getUserProfile = async () => {
    if (!user?.id) return;

    const fetchedUserProfile = await UserService.getOne(user.id);
    setUserProfile(fetchedUserProfile);

    if (!fetchedUserProfile) {
      console.error("Profil utilisateur non trouvé");
    }
  };

  const deleteAccount = async () => {
    if (!user?.id) return;

    if (confirm("Voulez-vous vraiment supprimer votre compte ?")) {
      await UserService.delete(user.id, true);
      router.push("/");
    }
  };

  useEffect(() => {
    void getUserProfile();
  }, [user]);

  return (
    <div>
      <h1>Mon profil</h1>

      {user?.id && (
        <>
          <OffCanvas
            autoCloseOnClick={true}
            buttonContent="Modifier mon profil"
            buttonClassName="btn btn-primary mb-30"
            dialogClassName="update-user-offcanvas"
          >
            <UpdateUser
              userId={user?.id}
              onSuccess={async () => {
                await getUserProfile();
              }}
              initData={userProfile}
            />
          </OffCanvas>

          <OffCanvas
            autoCloseOnClick={true}
            buttonContent="Modifier mes images"
            buttonClassName="btn btn-outline-primary mb-30 ml-10"
            dialogClassName="update-user-files-offcanvas"
          >
            <UpdateUserFiles
              onSuccess={async () => {
                await getUserProfile();
              }}
              initData={userProfile}
            />
          </OffCanvas>
        </>
      )}

      <div className="user">
        {userProfile && <Profile user={userProfile} fromDashboard />}
      </div>

      <div className="delete-account">
        <button className="btn btn-red" onClick={deleteAccount}>
          Supprimer mon compte
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
