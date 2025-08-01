import { type FileDto } from "@rent-to-craft/dtos";
import imageCompression from "browser-image-compression";

interface ErrorWithStatus {
  message: string;
  status?: number;
  response?: {
    data?: Record<string, unknown> | string;
    message?: string;
  };
}

class AppServiceClass {
  async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
    };
    return imageCompression(file, options);
  }

  processFile(file: FileDto): File {
    if (typeof file.file === "string" && file.file.startsWith("data:")) {
      return this.base64ToFile(file.file, file.name ?? "untitled");
    }

    const processedFile = new File([file.file], file.name ?? "untitled", {
      type: "image/webp",
    });
    return processedFile;
  }

  isValidBase64(base64: string): boolean {
    try {
      if (!base64 || typeof base64 !== "string") return false;

      let processedBase64 = base64;
      if (base64.startsWith("data:")) {
        const parts = base64.split(",");
        if (parts.length !== 2) return false;
        processedBase64 = parts[1];
      }

      return btoa(atob(processedBase64)) === processedBase64;
    } catch {
      return false;
    }
  }

  base64ToFile(base64: string, filename: string): File {
    if (!this.isValidBase64(base64)) {
      console.error("Invalid base64 string:", base64);
      throw new Error("Invalid base64 string provided");
    }

    const array = base64.split(",");
    const mimeMatch = /:(.*?);/.exec(array[0]);
    const mime = mimeMatch?.[1] ?? "image/webp";
    const bstr = atob(array[1]);
    const u8array = new Uint8Array(bstr.length);

    for (let index = 0; index < bstr.length; index++) {
      const codePoint = bstr.codePointAt(index);
      if (codePoint !== undefined) {
        u8array[index] = codePoint;
      }
    }

    return new File([u8array], filename, { type: mime });
  }

  private createDataUrlFromBase64(fileString: string): string | null {
    try {
      const dataUrl = `data:image/webp;base64,${fileString}`;
      return this.isValidBase64(dataUrl) ? dataUrl : null;
    } catch {
      console.warn("Failed to create data URL from base64 string");
      return null;
    }
  }

  private createBlobUrl(binaryString: string): string | null {
    try {
      const bytes = new Uint8Array(binaryString.length);
      for (let index = 0; index < binaryString.length; index++) {
        const codePoint = binaryString.codePointAt(index);
        if (codePoint !== undefined) {
          bytes[index] = codePoint;
        }
      }
      const blob = new Blob([bytes], { type: "image/webp" });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Failed to process binary data:", error);
      return null;
    }
  }

  createImageUrl(file: FileDto): string {
    try {
      if (typeof file.file !== "string") {
        console.error("Unsupported file format:", typeof file.file);
        return "";
      }

      if (file.file.startsWith("data:")) {
        if (this.isValidBase64(file.file)) {
          return file.file;
        }
        console.error("Invalid base64 data in file:", file);
        return "";
      }

      const dataUrl = this.createDataUrlFromBase64(file.file);
      if (dataUrl) {
        return dataUrl;
      }

      const blobUrl = this.createBlobUrl(file.file);
      return blobUrl ?? "";
    } catch (error) {
      console.error("Error creating image URL:", error);
      return "";
    }
  }

  setCookie = (name: string, value: string, days: number = 7) => {
    if (typeof window === "undefined") return;

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
    if (typeof window !== "undefined" && window.document) {
      window.document.cookie = cookieString;
    }
  };

  getCookie = (): string | null => {
    if (typeof window === "undefined" || !window.document) return null;

    const cookies = window.document.cookie.split("; ");
    const authCookie = cookies.find((cookieItem) =>
      cookieItem.startsWith("auth-token="),
    );
    return authCookie ? authCookie.split("=")[1] : null;
  };

  deleteCookie = (name: string) => {
    if (typeof window === "undefined" || !window.document) return;

    const cookieString = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    window.document.cookie = cookieString;
  };

  objectToFormData = (
    object: Record<string, unknown>,
    form?: FormData,
  ): FormData => {
    const formData = form ?? new FormData();
    console.log("Converting object to FormData:", object);

    for (const [key, value] of Object.entries(object)) {
      if (value === null || value === undefined) continue;
      console.log(`Processing key: ${key}, value:`, value);

      if (value instanceof File) {
        formData.append(key, value, value.name);
      } else if (Array.isArray(value)) {
        value.forEach((item, index) => {
          this.objectToFormData({ [index]: item }, formData);
        });
      } else if (typeof value === "object") {
        this.objectToFormData(value as Record<string, unknown>, formData);
      } else if (typeof value === "boolean") {
        formData.append(key, value ? "true" : "false");
      } else {
        formData.append(key, String(value));
      }
    }

    return formData;
  };

  errorMessages = (error: ErrorWithStatus) => {
    if (error.status) {
      switch (error.status) {
        case 400: {
          return "Requête invalide";
        }
        case 401: {
          return "Non autorisé";
        }
        case 403: {
          return "Accès interdit";
        }
        case 404: {
          return "Ressource non trouvée";
        }
        case 409: {
          return "Élément dupliqué ou existant";
        }
        case 500: {
          return "Erreur interne du serveur";
        }
        default: {
          return "Erreur inconnue";
        }
      }
    }

    if (error.response?.data) {
      const { data } = error.response;
      if (typeof data === "string") {
        return data;
      }
      if (typeof data === "object" && data != null) {
        return Object.values(data).join(", ");
      }
    }

    return error.message ?? "Une erreur est survenue";
  };
}

const AppService = new AppServiceClass();
export default AppService;
