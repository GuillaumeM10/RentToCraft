"use client";

import type React from "react";

import { type RentalCommentDto, type RentalDto } from "@rent-to-craft/dtos";
import { useState } from "react";

import RentalService from "@/app/services/rental.service";

type CreateRentalCommentProps = {
  readonly rental: RentalDto;
  readonly onSuccess?: (comment: RentalCommentDto) => void;
};

const CreateRentalCommnent = ({
  rental,
  onSuccess,
}: CreateRentalCommentProps) => {
  const [content, setContent] = useState("");

  const handleSubmit = async (element: React.FormEvent) => {
    element.preventDefault();
    const commentData: Partial<RentalCommentDto> = {
      rental: { id: rental.id },
      content,
    };
    const createdComment = await RentalService.createComment(commentData);
    if (onSuccess) {
      onSuccess(createdComment);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="content">
          Commentaire
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(element) => setContent(element.target.value)}
          className="form-input"
          required
          placeholder="Votre commentaire..."
          rows={3}
          maxLength={255}
        />
      </div>
      <p className="text-sm text-gray-500">{content.length} / 255 caractères</p>
      <button type="submit" className="btn btn-primary">
        Envoyer
      </button>
    </form>
  );
};

export default CreateRentalCommnent;
