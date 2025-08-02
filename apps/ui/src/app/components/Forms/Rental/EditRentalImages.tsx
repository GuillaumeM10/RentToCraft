"use client";
import { type FileDto, type RentalDto } from "@rent-to-craft/dtos";
import { useEffect, useRef, useState } from "react";

import AppService from "@/app/services/app.service";
import RentalService from "@/app/services/rental.service";

import { LoadingSpinner } from "../../LoadingSpinner";
type EditRentalImagesProps = {
  readonly initData?: Partial<RentalDto> | null;
  readonly onSuccess?: () => void;
};
const EditRentalImages = ({ initData, onSuccess }: EditRentalImagesProps) => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [existingFiles, setExistingFiles] = useState<string[]>([]);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const inputFiles = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (element: React.FormEvent) => {
    element.preventDefault();
    setError("");
    setIsLoading(true);

    if (!initData?.id) {
      setError("Aucun identifiant de location fourni.");
      setIsLoading(false);
      return;
    }
    if (!files || files.length === 0) {
      setError("Veuillez sélectionner au moins un fichier.");
      setIsLoading(false);
      return;
    }

    try {
      await RentalService.uploadFile(initData.id, files);
    } catch (thisError) {
      setError(
        thisError instanceof Error ? thisError.message : "Erreur de connexion",
      );
    } finally {
      setIsLoading(false);
      setFiles(null);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    setError("");
    setIsLoading(true);
    try {
      await RentalService.removeFile(fileId);
      setExistingFiles((previous) => previous.filter((id) => id !== fileId));
    } catch (thisError) {
      setError(
        thisError instanceof Error ? thisError.message : "Erreur de connexion",
      );
    } finally {
      setIsLoading(false);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  useEffect(() => {
    if (initData?.images && initData.images.length > 0) {
      setExistingFiles(
        initData.images.map((image) =>
          AppService.createImageUrl(image as FileDto),
        ),
      );
    }
  }, [initData]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group ">
        <label htmlFor="rental-images" className="form-label text-2xl tac">
          Images de la location
        </label>
        <input
          type="file"
          id="rental-images"
          ref={inputFiles}
          className="form-input"
          multiple
          accept="image/*"
          onChange={(element) => {
            if (element.target.files) {
              setFiles(Array.from(element.target.files));
            }
          }}
        />

        {files && files.length > 0 && (
          <div className="file-preview">
            {files.map((file, index) => (
              <div
                key={file.name}
                className="file-item  flex flex-col items-center"
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`File ${index + 1}`}
                  width={300}
                  className="my-20"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFiles((previous) =>
                      previous
                        ? previous.filter((_, previousIndex) => previousIndex !== index)
                        : null,
                    );
                  }}
                  className="btn btn-red"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}

        {existingFiles.length > 0 && (
          <div className="existing-files">
            {existingFiles.map((fileUrl, index) => (
              <div
                key={fileUrl}
                className="file-item flex flex-col items-center"
              >
                <img
                  src={fileUrl}
                  alt={`File ${index + 1}`}
                  width={300}
                  className="my-20"
                />
                {existingFiles && existingFiles.length > 1 && (
                  <button
                    type="button"
                    onClick={async () => {
                      const image = initData?.images?.[index];
                      if (image && typeof image === "object" && "id" in image) {
                        await handleDeleteFile(image.id as unknown as string);
                      }
                    }}
                    className="btn btn-red"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        type="button"
        className="btn btn-outline-primary"
        onClick={() => inputFiles.current?.click()}
      >
        Choisir des fichiers
      </button>

      <button type="submit" className="btn btn--primary w-full mb-lg">
        {isLoading ? <LoadingSpinner size="small" light /> : "Envoyer"}
      </button>
    </form>
  );
};

export default EditRentalImages;
