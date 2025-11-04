import CustomPrevArrowButton from '../layout/button/CustomPrevArrowButton';
import CustomNextArrowButton from '../layout/button/CustomNextArrowButton';

export const SLIDER_BREAKPOINTS = {
  DESKTOP_LARGE: 1280,
  DESKTOP: 1024,
  TABLET: 768,
  MOBILE: 640,
};

export const SLIDER_RESPONSIVE = [
  {
    breakpoint: SLIDER_BREAKPOINTS.DESKTOP_LARGE,
    settings: {
      slidesToShow: 4,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: SLIDER_BREAKPOINTS.DESKTOP,
    settings: {
      slidesToShow: 3,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: SLIDER_BREAKPOINTS.TABLET,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 1,
    },
  },
  {
    breakpoint: SLIDER_BREAKPOINTS.MOBILE,
    settings: {
      slidesToShow: 2,
      slidesToScroll: 1,
    },
  },
];

export const createSliderSettings = (customProps = {}) => ({
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 4000,
  pauseOnHover: true,
  prevArrow: <CustomPrevArrowButton />,
  nextArrow: <CustomNextArrowButton />,
  responsive: SLIDER_RESPONSIVE,
  ...customProps,
});
