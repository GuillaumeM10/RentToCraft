import { type UserDto } from "@rent-to-craft/dtos";

export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
  signin: (email: string, password: string) => Promise<boolean>;
  user: UserDto | null;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName?: string,
  ) => Promise<boolean>;
}
