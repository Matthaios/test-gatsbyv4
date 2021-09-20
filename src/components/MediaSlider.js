import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

import { css } from "@emotion/react";
import tw from "twin.macro";
import cn from "classnames";
import ReactPlayer from "react-player";
import { GatsbyImage } from "gatsby-plugin-image";
import get from "lodash/get";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import SwiperCore, { Thumbs } from "swiper/core";
import screenfull from "screenfull";
import {
  BsFillVolumeUpFill,
  BsVolumeMuteFill,
  BsFullscreenExit,
  BsArrowsFullscreen,
} from "react-icons/bs";
import MediaModal from "./MediaModal";
import { FaPlay } from "react-icons/fa";
import { GrThreeD } from "react-icons/gr";
import { FiExternalLink } from "react-icons/fi";
import { AnimateSharedLayout, motion } from "framer-motion";
import { useQuery } from "react-query";

SwiperCore.use([Thumbs]);

const isIPhone =
  typeof window !== "undefined" &&
  window.navigator &&
  window.navigator.userAgent.match(/iPhone/);

const isSafari =
  typeof window !== "undefined" &&
  window.navigator &&
  navigator.userAgent.indexOf("Safari") != -1 &&
  navigator.userAgent.indexOf("Mac") != -1 &&
  navigator.userAgent.indexOf("Chrome") == -1;

export default function MediaSlider({ items, isLocked, editionId }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ownerView, setOwnerView] = useState(true);

  useEffect(() => {
    function catchEscape(e) {
      if (e.key == "Escape") {
        setModalIsOpen(false);
      }
    }

    typeof window !== "undefined" &&
      window.addEventListener("keyup", catchEscape);
    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("keyup", catchEscape);
    };
  }, []);
  return (
    <>
      {" "}
      <div
        className={cn("row row-x-4 row-y-4  overflow-hidden items-stretch", {
          "pointer-events-none filter grayscale": isLocked,
        })}
        css={css`
          .swiper-container {
            width: 100%;
          }
          .swiper-slide {
            width: 100%;
            height: 100%;

            img,
            video,
            .gatsby-image-wrapper {
              max-height: 100%;
              width: 100%;
              object-fit: contain;
            }
          }
        `}
      >
        <div className=" h-[400px]  lg:h-auto  lg:max-h-[500px] w-full md:w-3/4 lg:w-full xl:w-3/4">
          <Swiper
            id="main"
            className="h-full "
            effect
            slidesPerView={1}
            thumbs={{ swiper: thumbsSwiper }}
          >
            {items?.map((item, i) => {
              return (
                <SwiperSlide key={i}>
                  {({ isActive }) => {
                    return (
                      <div
                        onClick={() => {
                          if (ownerView) {
                            setModalIsOpen(i);
                          }
                        }}
                        className={cn(
                          "flex justify-center w-full h-full bg-white bg-opacity-5 ",
                          { "hover:cursor-[zoom-in]": ownerView }
                        )}
                      >
                        {modalIsOpen == false && (
                          <MediaResolver
                            isActive={isActive && modalIsOpen == false}
                            item={item}
                            layout="asset"
                            main
                          />
                        )}
                      </div>
                    );
                  }}
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="w-full md:w-1/4 lg:w-full xl:w-1/4">
          <Swiper
            id="thumbs"
            spaceBetween={"16"}
            slidesPerView={3}
            onSwiper={setThumbsSwiper}
            direction={"horizontal"}
            breakpoints={{
              768: {
                direction: "vertical",
                slidesPerView: 3,
              },
              1024: {
                direction: "horizontal",
                slidesPerView: 3,
              },
              1280: {
                direction: "vertical",
                slidesPerView: 3,
              },
            }}
            css={css`
              .swiper-slide {
                height: 100px !important;
                img,
                video,
                .gatsby-image-wrapper {
                  max-height: 100%;
                  width: 100%;
                  object-fit: contain;
                }
              }
            `}
          >
            {items?.map((item, i) => {
              return (
                <SwiperSlide key={i}>
                  <div className="flex justify-center w-full h-full bg-white cursor-pointer bg-opacity-5">
                    <MediaResolver thumb isActive={false} item={item} />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>{" "}
      <MediaModal isOpen={modalIsOpen !== false} setIsOpen={setModalIsOpen}>
        {modalIsOpen === false ? null : (
          <div
            id="media-modal"
            className={cn("flex justify-center  w-full h-full", {})}
            css={css`
              img,
              video,
              .gatsby-image-wrapper {
                object-fit: contain;
              }
            `}
          >
            <MediaResolver
              layout="asset"
              isPopup={true}
              volume={true}
              isActive={true}
              item={items[modalIsOpen]}
            />
          </div>
        )}
      </MediaModal>
    </>
  );
}

function MediaResolver({ item, isPopup, layout, isActive, thumb }) {
  const [video, setVideo] = useState({
    play: !thumb && isActive && !isIPhone && !isSafari,
    muted: false,
    volume: 1,
    isFullscreen: false,
  });
  const videoState = useRef(video);
  const videoRef = useRef();
  const videoQuery = useQuery(["video", item.url], () => {
    return videoRef?.current?.getCurrentTime();
  });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    videoState.current = video;
  }, [video]);
  useEffect(() => {
    if (ready) {
      videoRef?.current?.seekTo?.(videoQuery.data || 0, "seconds");
    }
  }, [ready]);
  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.on("change", () => {
        setVideo({
          ...videoState.current,
          isFullscreen: screenfull.isFullscreen,
        });
      });
    }
  }, []);
  useEffect(() => {
    setVideo({
      ...video,
      play: isActive && !isIPhone && !isSafari,
    });
    videoState.current = {
      ...video,
      play: isActive && !isIPhone,
    };
  }, [isActive]);

  useEffect(() => {
    function catchKeys(e) {
      if (!isPopup) {
        return;
      }

      if (e.code == "Space") {
        e.preventDefault();

        setVideo({
          ...videoState.current,
          play: !videoState.current.play,
        });
      } else if (e.code == "KeyM") {
        e.preventDefault();

        setVideo({
          ...videoState.current,
          muted: !videoState.current.muted,
        });
      } else if (e.code == "KeyF") {
        e.preventDefault();
        if (isIPhone) {
          setVideo({
            ...videoState.current,
            play: !videoState.current.play,
          });
        } else {
          screenfull.toggle(document.getElementById("project-wrapper"));
        }
      }
    }

    typeof window !== "undefined" &&
      window.addEventListener("keydown", catchKeys);
    return () => {
      typeof window !== "undefined" &&
        window.removeEventListener("keydown", catchKeys);
    };
  }, []);

  switch (item.type) {
    case "video":
      return (
        <motion.div layout={layout} className="relative w-full h-full">
          {!thumb && !video.play && (
            <FaPlay
              onClick={() => {
                setVideo({ ...video, play: true });
              }}
              className="absolute z-10 w-4 h-4 text-white transform -translate-x-1/2 -translate-y-1/2 opacity-80 hover:opacity-100 top-1/2 left-1/2"
            />
          )}
          <ReactPlayer
            width="100%"
            height="100%"
            onReady={() => {
              setReady(true);
            }}
            ref={videoRef}
            onProgress={() => {
              videoQuery.refetch();
            }}
            muted={video.muted}
            loop
            controls={isIPhone || isSafari}
            playing={!thumb && video.play}
            url={item.url}
          />
          {!isIPhone && !isSafari && (
            <Controls
              type="video"
              setVideo={setVideo}
              video={video}
              isPopup={isPopup}
              isActive={isActive}
            />
          )}
        </motion.div>
      );
    case "image":
      return (
        <>
          {" "}
          <GatsbyImage
            objectFit="contain"
            objectPosition="50% 50%"
            imgStyle={{ margin: "0 auto" }}
            alt=""
            image={get(item, "file.sharp.gatsbyImageData")}
          />
          <Controls
            type="image"
            video={video}
            isPopup={isPopup}
            isActive={isActive}
          />
        </>
      );
    case "gif":
      return (
        <>
          <img className="object-contain gif " src={get(item, "file.url")} />{" "}
          <Controls
            type="gif"
            video={video}
            isPopup={isPopup}
            isActive={isActive}
          />
        </>
      );
    case "object":
      return (
        <>
          {" "}
          <div
            className={`relative w-full h-full ${
              thumb ? "pointer-events-none" : ""
            }`}
          >
            <ObjectIframe src={item?.file?.url} thumb={thumb} />
            {thumb && (
              <div
                css={css`
                  svg path {
                    stroke: #fff !important;
                  }
                `}
                className="absolute inset-0 flex items-center justify-center w-full h-full text-white"
              >
                <GrThreeD className="w-10 h-10 mt-2 " />
              </div>
            )}
          </div>{" "}
          <Controls
            type="object"
            video={video}
            isPopup={isPopup}
            isActive={isActive}
          />
        </>
      );
    default:
      return null;
  }
}
function Controls({ type, video, setVideo, isActive, isPopup }) {
  return (
    <div className="absolute z-40 space-y-2 bottom-4 right-4">
      {type == "video" && isActive && (
        <div
          className="p-2 text-lg opacity-50 bg-primary hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            setVideo({
              ...video,
              muted: !video.muted,
            });
          }}
        >
          {video.muted && <BsVolumeMuteFill />}
          {!video.muted && <BsFillVolumeUpFill />}
        </div>
      )}
      {type == "object" && isActive && !isPopup && (
        <div className="p-2 text-lg opacity-50 bg-primary hover:opacity-100">
          <FiExternalLink />
        </div>
      )}
      {isPopup && (
        <div
          className="p-2 text-lg opacity-50 bg-primary hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            screenfull.toggle(document.getElementById("project-wrapper"));
          }}
        >
          {!video.isFullscreen && <BsArrowsFullscreen />}
          {video.isFullscreen && <BsFullscreenExit />}
        </div>
      )}
    </div>
  );
}

function ObjectIframe({ src, thumb }) {
  return (
    <iframe
      width="100%"
      height="100%"
      srcDoc={`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script
      type="module"
      src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"
    ></script>
    <style>
    body, html {
      height: 100%;
      max-height: 100vh;
      overflow: hidden;
    }
  model-viewer#model  {


 --poster-color:#150728;
    width: 100%;
    height: 100%;
  }

</style>
  </head>
  <body>
    <model-viewer
id="model"
    loading="eager"
    ${thumb ? `reveal="interaction"` : ""}
      src="${src}"
      camera-controls
    ></model-viewer>
  </body>
</html>
`}
    />
  );
}
