import { IKImage } from "imagekitio-react";
import React from "react";

const Image = ({ src, className, alt }) => {
  const isFullUrl = src?.startsWith("http");

  return (
    <IKImage
      urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
      {...(isFullUrl ? { src } : { path: src })}
      loading="lazy"
      lqip={{ active: true, quality: 20 }}
      alt={alt}
      className={className}
    />
  );
};

export default Image;
