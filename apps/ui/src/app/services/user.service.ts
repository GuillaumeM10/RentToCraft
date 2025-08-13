import { type UserDto } from "@rent-to-craft/dtos";

import api from "./api.service";

type UserServiceType = {
  update: (userId: number, user: Partial<UserDto>) => Promise<boolean | string>;
  deleteFile: (type: "banner" | "profilePicture") => Promise<boolean | string>;
  uploadFile: (
    type: "banner" | "profilePicture",
    file: File,
  ) => Promise<boolean | string>;
  getOne: (userId: number) => Promise<UserDto | null>;
  getAll: () => Promise<UserDto[]>;
  delete: (userId: number) => Promise<boolean | string>;
};
const UserService: UserServiceType = {
  update: async (userId, user) => {
    try {
      const response = await api.put(`/user/${userId}`, user);

      if (response.status === 200) {
        return true;
      }

      const errorMessage =
        typeof response.data.error === "string"
          ? response.data.error
          : (response.data.error?.message ?? "Erreur inconnue");

      return `Erreur: ${errorMessage}`;
    } catch (error) {
      console.log(error);
      return `Erreur réseau: ${error instanceof Error ? error.message : "Erreur inconnue"}`;
    }
  },

  deleteFile: async (type: "banner" | "profilePicture") => {
    try {
      const response = await api.delete(`/user/file`, { data: { type } });
      if (response.status === 200) {
        return true;
      }

      const errorMessage =
        typeof response.data.error === "string"
          ? response.data.error
          : (response.data.error?.message ?? "Erreur inconnue");

      return `Erreur: ${errorMessage}`;
    } catch (error) {
      console.log(error);
      return `Erreur réseau: ${error instanceof Error ? error.message : "Erreur inconnue"}`;
    }
  },

  uploadFile: async (type: "banner" | "profilePicture", file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("type", type);

      const response = await api.put(`/user/file`, formData);

      if (response.status === 200) {
        return true;
      }

      const errorMessage =
        typeof response.data.error === "string"
          ? response.data.error
          : (response.data.error?.message ?? "Erreur inconnue");

      return `Erreur: ${errorMessage}`;
    } catch (error) {
      console.log(error);
      return `Erreur réseau: ${error instanceof Error ? error.message : "Erreur inconnue"}`;
    }
  },

  getOne: async (userId) => {
    try {
      const response = await api.get<UserDto>(`/user/${userId}`);
      if (response.status === 200) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Erreur de récupération de l'utilisateur:", error);
      return null;
    }
  },

  getAll: async () => {
    try {
      const response = await api.get<UserDto[]>("/user");
      return response.data;
    } catch (error) {
      console.error("Erreur de récupération des utilisateurs:", error);
      return [];
    }
  },

  delete: async (userId) => {
    try {
      const response = await api.delete(`/user/${userId}`);
      return response.status === 200;
    } catch (error) {
      console.error("Erreur de suppression de l'utilisateur:", error);
      return false;
    }
  },
};

export default UserService;
