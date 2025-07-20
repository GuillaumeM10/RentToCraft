import axios from "axios";
import { UserDto } from "@rent-to-craft/dtos";

type UserServiceType = {};
const UserService: UserServiceType = {
  update: async (user: UserDto) => {
    // TODO
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
        return `Error: ${errorData.message || "Unknown error"}`;
      }
      return `Network error: ${error instanceof Error ? error.message : "Unknown error"}`;
    }
  },
};

export default UserService;
