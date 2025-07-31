import { UserDto } from "@rent-to-craft/dtos";
import axios from "axios";

type UserServiceType = {
  update: (userId: number, user: Partial<UserDto>) => Promise<boolean | string>;
  getOne: (userId: number) => Promise<UserDto | null>;
};
const UserService: UserServiceType = {
  update: async (userId, user) => {
    try {
      const formData = new FormData();

      Object.entries(user).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value as string | Blob);
        }
      });

      const response = await fetch(`/api/user/update/${userId}`, {
        method: "PUT",
        body: formData,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        return true;
      }

      const errorMessage =
        typeof data.error === "string"
          ? data.error
          : (data.error?.message ?? "Erreur inconnue");

      return `Erreur: ${errorMessage}`;
    } catch (error) {
      console.log(error);
      return `Erreur réseau: ${error instanceof Error ? error.message : "Erreur inconnue"}`;
    }
  },

  getOne: async (userId) => {
    try {
      const response = await axios.get<UserDto>(`/api/user/getOne/${userId}`);
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Erreur de récupération de l'utilisateur:", error);
      return null;
    }
  },
};

export default UserService;
