import axios from "axios";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

import { clientConfig } from "@/app/config/env";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const response = await axios.post(
      `${clientConfig.API_URL}/auth/signin`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 201 && response.data?.accessToken) {
      const cookieStore = await cookies();

      cookieStore.set("auth-token", response.data.accessToken, {
        httpOnly: true,
        secure: clientConfig.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24h
        path: "/",
      });

      return NextResponse.json({
        success: true,
        user: response.data.accessToken,
      });
    }

    return NextResponse.json(
      { error: response.data.message ?? "Connexion échouée" },
      { status: response.status },
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data.message ?? "Connexion échouée" },
        { status: error.response.status },
      );
    }
    return NextResponse.json(
      { error: "Une erreur réseau est survenue" },
      { status: 500 },
    );
  }
}
