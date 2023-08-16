Список пропсов компонента:

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



Сам компонент:

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
  }


 
Задаем базовый флаг isLoaded для изменения стилей и контроля за состоянием загрузки
imgPlaceholder - это и есть строка blurhash
imageSrc - сюда будет “сетиться” ссылка на исходное изображение (по дефолту пустая строка. или, как в нашем случае, объект из нескольких полей)
imageRef - для отслеживания попадания картинки в область видимости юзера
onLoad - хендлер успешной загрузки изображения








Добавляем useEffect, который выполняет основную работу:
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


Используем IntersectionObserver для отслеживания попадания изображения в зону видимости, когда это происходит - сетим данные в Picture и отменяем подписку.














Собственно jsx:
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


Здесь используется styled-components, но это не принципиально.

StyledLazyImage - div контейнер, его стили: 
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


Blurhash - это компонент библиотеки react-blurhash, его пропсы:


StyledBlurhash - контейнер для компонента Blurhash, его стили:

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
      `
  }
`;


const displayAnim = keyframes`
  to {
    display: none;
  }
`;

Скорость и плавность скрытия Blurhash можно регулировать через transition и animation.

Picture - компонент картинки (его можно заменить на NextImage или любой другой, он должен возвращать image).

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




Он принимает ссылки на все типы изображений и сетит их в <picture />






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


