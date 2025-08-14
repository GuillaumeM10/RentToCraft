import { type FileDto } from "@rent-to-craft/dtos";
import React from "react";

import AppService from "../services/app.service";

type ImgProps = {
  readonly image: FileDto | string | null;
  readonly alt?: string;
  readonly className?: string;
  readonly width?: number;
  readonly height?: number;
};

const Img = ({ image, alt, className, width, height }: ImgProps) => {
  let source;

  if (typeof image === "string") {
    source = image;
  } else if (typeof image === "object") {
    source = image?.file
      ? AppService.createImageUrl(image)
      : "/images/default-pp.png";
  }
  return (
    <img
      src={source}
      alt={alt ?? ""}
      className={className}
      width={width}
      height={height}
    />
  );
};

export default Img;
