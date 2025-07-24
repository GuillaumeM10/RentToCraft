import { type UserDto } from "@rent-to-craft/dtos";
import axios from "axios";

type UserServiceType = {
  update: (user: UserDto) => Promise<void>;
  getUsersService: () => Promise<UserDto[] | string>;
};
const UserService: UserServiceType = {
  update: async (user: UserDto) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message ?? "Failed to update user");
      }
    } catch (error) {
      console.error("Update user error:", error);
      throw error;
    }
  },

  getUsersService: async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
        method: "GET",
      });
      const data = await response.json();
      const users: UserDto[] = data.users;
      return users;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const errorData = error.response.data;
        return `Error: ${errorData.message ?? "Unknown error"}`;
      }
      return `Network error: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },
};

export default UserService;
