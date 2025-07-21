import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token");

    if (token) {
      try {
        await axios.post(
          `${process.env.API_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
              "Content-Type": "application/json",
            },
          },
        );
      } catch (error) {
        console.error("Logout API call failed:", error);
      }

      cookieStore.delete("auth-token");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
