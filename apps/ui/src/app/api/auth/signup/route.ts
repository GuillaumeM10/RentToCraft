import axios from "axios";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { email, password, firstName, lastName } = await request.json();

  try {
    const response = await axios.post(
      `${process.env.API_URL}/auth/signup`,
      {
        email,
        password,
        firstName,
        lastName,
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
        message: "Registration successful",
      });
    }

    return NextResponse.json(
      { error: response.data.message ?? "Registration failed" },
      { status: response.status },
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return NextResponse.json(
        { error: error.response.data.message ?? "Registration failed" },
        { status: error.response.status },
      );
    }
    return NextResponse.json(
      { error: "Network error occurred" },
      { status: 500 },
    );
  }
}
