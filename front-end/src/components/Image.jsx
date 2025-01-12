import { IKImage } from 'imagekitio-react'
import React from 'react'

const Image = ({src, className, alt}) => {
  return (
    <IKImage
    urlEndpoint={import.meta.env.VITE_IK_URL_ENDPOINT}
    path={src}
    loading='lazy'
    lang={{active:true, quality:20}}
    alt={alt}
    className={className}
  />
  )
}

export default Image