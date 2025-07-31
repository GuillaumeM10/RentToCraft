import { FileDto } from "@rent-to-craft/dtos";
import imageCompression from "browser-image-compression";

class AppServiceClass {
  async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
    };
    return await imageCompression(file, options);
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

      if (base64.startsWith("data:")) {
        const parts = base64.split(",");
        if (parts.length !== 2) return false;
        base64 = parts[1];
      }

      return btoa(atob(base64)) === base64;
    } catch (err) {
      return false;
    }
  }

  base64ToFile(base64: string, filename: string): File {
    if (!this.isValidBase64(base64)) {
      console.error("Invalid base64 string:", base64);
      throw new Error("Invalid base64 string provided");
    }

    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/webp";
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);

    for (let i = 0; i < bstr.length; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  }

  createImageUrl(file: FileDto): string {
    try {
      if (typeof file.file === "string" && file.file.startsWith("data:")) {
        if (this.isValidBase64(file.file)) {
          return file.file;
        } else {
          console.error("Invalid base64 data in file:", file);
          return "";
        }
      }

      if (typeof file.file === "string" && !file.file.startsWith("data:")) {
        try {
          const dataUrl = `data:image/webp;base64,${file.file}`;
          if (this.isValidBase64(dataUrl)) {
            return dataUrl;
          }
        } catch (error) {
          console.warn("Failed to create data URL from base64 string");
        }
      }

      if (typeof file.file === "string") {
        try {
          const binaryString = file.file;
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: "image/webp" });
          return URL.createObjectURL(blob);
        } catch (error) {
          console.error("Failed to process binary data:", error);
        }
      }

      console.error("Unsupported file format:", typeof file.file);
      return "";
    } catch (error) {
      console.error("Error creating image URL:", error);
      return "";
    }
  }
}

const AppService = new AppServiceClass();
export default AppService;
