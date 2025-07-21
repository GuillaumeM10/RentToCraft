import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { UserDto } from "@rent-to-craft/dtos";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
      const decodedToken: UserDto = jwtDecode(token.value);
      return NextResponse.json({
        authenticated: true,
        user: decodedToken,
      });
    } catch (error) {
      const cookieStore = await cookies();
      cookieStore.delete("auth-token");
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication check failed" },
      { status: 500 },
    );
  }
}
