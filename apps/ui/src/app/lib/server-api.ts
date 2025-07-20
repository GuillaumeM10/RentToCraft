import axios from "axios";
import { cookies } from "next/headers";

export async function createServerApiClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  return axios.create({
    baseURL: process.env.API_URL || "http://localhost:3000",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token.value}` }),
    },
  });
}
