import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  try {
    const response = await axios.post(
      `${process.env.API_URL}/auth/signup`,
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

    if (response.status === 201 || response.status === 200) {
      return NextResponse.json({
        success: true,
        message: "Inscription réussie",
      });
    }

    return NextResponse.json(
      { error: response.data.message ?? "Inscription échouée" },
      { status: response.status },
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data.message ?? "Inscription échouée" },
        { status: error.response.status },
      );
    }
    return NextResponse.json(
      { error: "Une erreur réseau est survenue" },
      { status: 500 },
    );
  }
}
