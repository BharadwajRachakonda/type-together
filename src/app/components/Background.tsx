import React from "react";
import red from "./images/red.png";
import blue from "./images/blue.png";
import green from "./images/green.png";
import violet from "./images/violet.png";
import Image from "next/image";

function Background() {
  return (
    <div className="absolute w-screen h-screen overflow-hidden md:overflow-visible">
      <Image
        src={red}
        alt="Background Image"
        className="hidden md:block absolute translate-y-[-50%] w-screen"
      />

      {/* {till here} */}

      <Image
        src={green}
        alt="Background Image"
        className="hidden md:block absolute w-screen "
      />

      <Image
        src={blue}
        alt="Background Image"
        className="absolute w-lvw h-screen md:h-auto translate-x-[70%] md:translate-x-[20%] md:-translate-y-[20%] overflow-x-hidden"
      />

      <Image
        src={violet}
        alt="Background Image"
        className="absolute w-lvw h-screen md:h-auto  translate-x-[-70%] md:translate-x-[-20%] md:-translate-y-[20%] overflow-x-hidden"
      />

      {/*
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 790 775"
        fill="none"
        className="absolute w-lvh h-lvh md:w-auto md:h-auto right-0 top-0 bottom-0"
      >
        <g filter="url(#filter0_dfg_1_6)">
          <ellipse
            cx="200"
            cy="200"
            rx="61.6724"
            ry="69.7173"
            transform="rotate(106 395.016 387.5)"
            fill="#6388AD"
            fillOpacity="0.86"
            shapeRendering="crispEdges"
          />
        </g>
        <defs>
          <filter
            id="filter0_dfg_1_6"
            x="0.860352"
            y="0.163147"
            width="788.311"
            height="774.674"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="75"
              operator="dilate"
              in="SourceAlpha"
              result="effect1_dropShadow_1_6"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="125" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.388929 0 0 0 0 0.534368 0 0 0 0 0.679808 0 0 0 0.97 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_1_6"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_1_6"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="25.45"
              result="effect2_foregroundBlur_1_6"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.016233766451478004 0.016233766451478004"
              numOctaves="3"
              seed="4163"
            />
            <feDisplacementMap
              in="effect2_foregroundBlur_1_6"
              scale="16.799999237060547"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedImage"
              width="100%"
              height="100%"
            />
            <feMerge result="effect3_texture_1_6">
              <feMergeNode in="displacedImage" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 790 775"
        fill="none"
        className="absolute top-0 left-0 bottom-0 w-lvh h-lvh md:w-auto md:h-auto"
      >
        <g filter="url(#filter0_dfg_4_3)">
          <ellipse
            cx="200"
            cy="200"
            rx="61.6724"
            ry="69.7173"
            transform="rotate(106 200 200)"
            fill="#7763AD"
            fillOpacity="0.86"
            shapeRendering="crispEdges"
          />
        </g>
        <defs>
          <filter
            id="filter0_dfg_4_3"
            x="0.860321"
            y="0.163147"
            width="788.311"
            height="774.674"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="75"
              operator="dilate"
              in="SourceAlpha"
              result="effect1_dropShadow_4_3"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="125" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.466496 0 0 0 0 0.388929 0 0 0 0 0.679808 0 0 0 0.86 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_4_3"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_4_3"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="25.45"
              result="effect2_foregroundBlur_4_3"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.016233766451478004 0.016233766451478004"
              numOctaves="3"
              seed="4163"
            />
            <feDisplacementMap
              in="effect2_foregroundBlur_4_3"
              scale="16.799999237060547"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedImage"
              width="100%"
              height="100%"
            />
            <feMerge result="effect3_texture_4_3">
              <feMergeNode in="displacedImage" />
            </feMerge>
          </filter>
        </defs>
      </svg> */}

      {/* To be till here */}

      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        width="790"
        height="775"
        viewBox="0 0 790 775"
        fill="none"
        className="hidden md:inline-block w-lvh h-lvh md:w-auto md:h-auto absolute left-0 top-0 bottom-0"
      >
        <g filter="url(#filter0_dfg_4_3)">
          <ellipse
            cx="395.016"
            cy="387.5"
            rx="61.6724"
            ry="69.7173"
            transform="rotate(106 395.016 387.5)"
            fill="#7763AD"
            fillOpacity="0.48"
            shapeRendering="crispEdges"
          />
        </g>
        <defs>
          <filter
            id="filter0_dfg_4_3"
            x="0.860321"
            y="0.163147"
            width="788.311"
            height="774.674"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="75"
              operator="dilate"
              in="SourceAlpha"
              result="effect1_dropShadow_4_3"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="125" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.384314 0 0 0 0 0.321569 0 0 0 0 0.556863 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_4_3"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_4_3"
              result="shape"
            />
            <feGaussianBlur
              stdDeviation="25.45"
              result="effect2_foregroundBlur_4_3"
            />
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.016233766451478004 0.016233766451478004"
              numOctaves="3"
              seed="4163"
            />
            <feDisplacementMap
              in="effect2_foregroundBlur_4_3"
              scale="16.799999237060547"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displacedImage"
              width="100%"
              height="100%"
            />
            <feMerge result="effect3_texture_4_3">
              <feMergeNode in="displacedImage" />
            </feMerge>
          </filter>
        </defs>
      </svg> */}
    </div>
  );
}

export default Background;
