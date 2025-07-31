import { type NextRequest, NextResponse } from "next/server";
import { createServerApiClient } from "@/app/lib/server-api";
import { UserDto } from "@rent-to-craft/dtos";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  try {
    const apiClient = await createServerApiClient();
    const contentType = request.headers.get("content-type");

    if (contentType?.includes("multipart/form-data")) {
      const frontendFormData = await request.formData();
      const backendFormData = new FormData();

      for (const [key, value] of frontendFormData.entries()) {
        if (value instanceof File) {
          backendFormData.append(key, value, value.name);
        } else {
          if (key === "isPublic") {
            backendFormData.append(key, value);
          } else if (key === "city" && value) {
            try {
              backendFormData.append(
                key,
                JSON.stringify(JSON.parse(value as string)),
              );
            } catch {
              backendFormData.append(key, value as string);
            }
          } else if (value !== "" && value !== null) {
            backendFormData.append(key, value as string);
          }
        }
      }

      console.log(`Updating user with ID: ${userId} with FormData`);

      const response = await apiClient.put(`/user/${userId}`, backendFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return NextResponse.json({ success: true, data: response.data });
    } else {
      const userData = await request.json();

      const response = await apiClient.put<UserDto>(
        `/user/${userId}`,
        userData,
      );
      return NextResponse.json({ success: true, data: response.data });
    }
  } catch (error) {
    console.error("Error updating user:", error);

    if (error && typeof error === "object" && "response" in error) {
      const apiError = error as {
        response: { data: { message?: string }; status: number };
      };
      return NextResponse.json(
        {
          error:
            apiError.response.data.message ??
            "Erreur lors de la mise à jour de l'utilisateur",
        },
        { status: apiError.response.status },
      );
    }
    return NextResponse.json(
      { error: "Une erreur réseau est survenue" },
      { status: 500 },
    );
  }
}
