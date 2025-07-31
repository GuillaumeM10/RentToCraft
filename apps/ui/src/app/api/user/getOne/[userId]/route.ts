import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";
import { clientConfig } from "@/app/config/env";
import { UserDto } from "@rent-to-craft/dtos";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const userId = (await params).userId;
  try {
    const response = await axios.get<UserDto>(
      `${clientConfig.API_URL}/user/${userId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 200) {
      return NextResponse.json(response.data);
    }

    return NextResponse.json(
      {
        error: "Erreur lors de la récupération de l'utilisateur",
      },
      { status: response.status },
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        {
          error:
            error.response.data.message ??
            "Erreur lors de la récupération de l'utilisateur",
        },
        { status: error.response.status },
      );
    }
    return NextResponse.json(
      { error: "Une erreur réseau est survenue" },
      { status: 500 },
    );
  }
}
