import {
  memo,
  ReactEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Blurhash } from "react-blurhash";
import styled, { css, keyframes } from "styled-components";

import { defaultBlurPlaceholder, defaultImageProps } from "./config";
import { IPicture, LazyPictureProps } from "./interfaces";
import Picture from "./";

export default memo(function LazyPicture({
  data,
  onLoadError,
  onLoadSuccess,
  className = "",
  ...props
}: LazyPictureProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { placeholder, ...imageProps } = data;

  const imgPlaceholder = useMemo(
    () => placeholder || defaultBlurPlaceholder,
    [placeholder]
  );

  const [imageSrc, setImageSrc] = useState<IPicture>(defaultImageProps);

  const imageRef = useRef<HTMLImageElement>(null);

  const _onLoad: ReactEventHandler<HTMLImageElement> = (event) => {
    const img = event.target;
    if (onLoadSuccess) onLoadSuccess(img);
    setIsLoaded(true);
  };

  useEffect(() => {
    let observer: IntersectionObserver;
    if (IntersectionObserver) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // when image is visible in the viewport + rootMargin
            if (entry.intersectionRatio > 0 || entry.isIntersecting) {
              setImageSrc(imageProps);
              imageRef?.current && observer.unobserve(imageRef?.current);
            }
          });
        },
        {
          threshold: 0.01,
          rootMargin: "20%",
        }
      );
      imageRef?.current && observer.observe(imageRef?.current);
    } else {
      // Old browsers fallback
      setImageSrc(imageProps);
    }
    return () => {
      imageRef?.current && observer.unobserve(imageRef.current);
    };
  }, []);

  return (
    <StyledLazyImage>
      <StyledBlurHash isHidden={isLoaded}>
        <Blurhash
          hash={imgPlaceholder}
          width={"100%"}
          height={"100%"}
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      </StyledBlurHash>
      <Picture
        ref={imageRef}
        {...imageSrc}
        {...props}
        className={`${className} ${!isLoaded && "lazy"}`}
        onLoad={_onLoad}
        onLoadError={onLoadError}
      />
    </StyledLazyImage>
  );
});
const StyledLazyImage = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  canvas {
    width: 100%;
    height: 100%;
  }
  .lazy {
    opacity: 0;
  }
`;
const StyledBlurHash = styled.div<{ isHidden?: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 22222;
  visibility: visible;
  transition: visibility 0.2s, opacity 0.2s;
  ${({ isHidden }) =>
    isHidden &&
    css`
      visibility: hidden;
      opacity: 0;
      animation: ${displayAnim} 0.2s;
    `}
`;

const displayAnim = keyframes`
  to {
    display: none;
  }
`;
