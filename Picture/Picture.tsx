import { forwardRef } from "react";

import { base64Pixel, defaultImageProps } from "./config";
import { PictureProps, PictureSources } from "./interfaces";

const Picture = forwardRef<any, PictureProps>((props, imageRef) => {
  const {
    noImageOnTouch = false,
    alt = "",
    onLoad,
    onLoadError,
    className = "",
  } = props;
  const desktopImages: PictureSources =
    props.desktop || defaultImageProps.desktop;
  const {
    x1: desktop_x1,
    x2: desktop_x2,
    webp_x1: desktop_webp_x1,
    webp_x2: desktop_webp_x2,
  } = desktopImages;

  const tabletImages: PictureSources =
    props.tablet || props.desktop || defaultImageProps.tablet;
  const {
    x1: tablet_x1,
    x2: tablet_x2,
    webp_x1: tablet_webp_x1,
    webp_x2: tablet_webp_x2,
  } = tabletImages;

  const mobileImages: PictureSources = props.mobile || defaultImageProps.mobile;
  const {
    x1: mobile_x1,
    x2: mobile_x2,
    webp_x1: mobile_webp_x1,
    webp_x2: mobile_webp_x2,
  } = mobileImages;

  return !Object.keys(props).length ? (
    <img src="/images/error-page-image.png" alt="error-image" />
  ) : desktop_x1 && desktop_x1.endsWith(".svg") ? (
    <img src={desktop_x1} alt="" />
  ) : (
    <picture>
      {noImageOnTouch && (
        <source
          media="(hover: none) and (pointer: coarse), (hover: none) and (pointer: fine)"
          srcSet={base64Pixel}
          sizes="100%"
        />
      )}
      <source
        type="image/webp"
        media={`(min-width: 1025px)`}
        srcSet={`${desktop_webp_x1}, ${desktop_webp_x2} 2x`}
      />
      <source
        media={`(min-width: 1025px)`}
        srcSet={`${desktop_x1}, ${desktop_x2} 2x`}
      />
      <source
        type="image/webp"
        media={`(min-width: 501px)`}
        srcSet={`${tablet_webp_x1}, ${tablet_webp_x2} 2x`}
      />
      <source
        media={`(min-width: 501px)`}
        srcSet={`${tablet_x1}, ${tablet_x2} 2x`}
      />

      <source
        type="image/webp"
        media={`(max-width: 500px)`}
        srcSet={`${mobile_webp_x1}, ${mobile_webp_x2} 2x`}
      />
      <source
        media={`(max-width: 500px)`}
        srcSet={`${mobile_x1}, ${mobile_x2} 2x`}
      />
      <img
        ref={imageRef}
        src={desktop_x1}
        srcSet={`${desktop_x2} 2x`}
        crossOrigin=""
        className={className}
        alt={alt}
        onLoad={onLoad}
        onError={onLoadError}
      />
    </picture>
  );
});

Picture.displayName = "Picture";
export default Picture;
