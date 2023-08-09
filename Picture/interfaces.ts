import { ReactEventHandler } from "react";

export interface IPicture {
  desktop?: PictureSources;
  tablet?: PictureSources;
  mobile?: PictureSources;
  placeholder?: string;
}

export type PictureSources = {
  x1: string;
  x2: string;
  webp_x1: string;
  webp_x2: string;
};

export interface PictureProps extends IPicture {
  alt?: string;
  noImageOnTouch?: boolean;
  onLoad?: ReactEventHandler<HTMLImageElement>;
  onLoadError?: ReactEventHandler<HTMLImageElement>;
  className?: string;
}

export interface LazyPictureProps {
  data: IPicture;
  alt?: string;
  placeholder?: string;
  breakpoints?: IBreakpoints;
  onLoadSuccess?: (img: EventTarget) => void;
  onLoadError?: () => void;
  className?: string;
}

export interface IBreakpoints {
  desktop: string;
  tablet: string;
  mobile: string;
}
