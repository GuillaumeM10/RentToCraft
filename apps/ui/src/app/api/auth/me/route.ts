import { type UserDto } from "@rent-to-craft/dtos";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (token) {
      try {
        const decodedToken: UserDto = jwtDecode(token.value);
        return NextResponse.json({
          authenticated: true,
          user: decodedToken,
        });
      } catch {
        cookieStore.delete("auth-token");
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    } else {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
  } catch {
    return NextResponse.json(
      { error: "Authentication check failed" },
      { status: 500 },
    );
  }
}
