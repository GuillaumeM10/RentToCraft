"use client";
import { type UserDto } from "@rent-to-craft/dtos";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useState } from "react";

import Profile from "@/app/components/Profile";
import UserService from "@/app/services/user.service";

type ProfilePageProps = {
  readonly params: Promise<{
    id: number;
  }>;
};

const ProfilePage = ({ params }: ProfilePageProps) => {
  const { id } = use(params);
  const router = useRouter();

  const [user, setUser] = useState<UserDto | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const fetcheduUser = await UserService.getOne(id);
      setUser(fetcheduUser);
    };
    void fetchUser();
  }, [id]);

  useEffect(() => {
    if (user && !user.isPublic) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return <div>Utilisateur non trouvé</div>;
  }

  return (
    <div className="layout-maxed">
      <Profile user={user} />
    </div>
  );
};

export default ProfilePage;
