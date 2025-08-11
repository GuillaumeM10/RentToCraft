"use client";

import { type FileDto, type RentalCommentDto } from "@rent-to-craft/dtos";
import React from "react";

import { useAuth } from "@/app/contexts/auth.context";
import RentalService from "@/app/services/rental.service";

import Img from "../Img";

type RentalCommentProps = {
  readonly comment: RentalCommentDto;
  readonly onRemove?: () => void;
};

const RentalComment = ({ comment, onRemove }: RentalCommentProps) => {
  const { content, author } = comment;
  const { isAuthenticated, user } = useAuth();

  const handleRemove = async () => {
    if (comment.id) {
      await RentalService.removeComment(comment.id);
      if (onRemove) {
        onRemove();
      }
    }
  };

  return (
    <>
      <div className="flex gap-20">
        <div className="flex align-items-center gap-10 shrink-0">
          <Img
            image={author.profilePicture as FileDto}
            alt="Profile"
            className="pp"
          />
          <p>{author.firstName}</p>
        </div>

        <div className="flex flex-col gap-10 border-l-2 border-gray-300 pl-20 justify-between">
          <p className="text-lg">{content}</p>

          {isAuthenticated && user?.id === author.id && (
            <button
              className="btn btn-underline-red w-fit"
              onClick={handleRemove}
            >
              Supprimer
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default RentalComment;
