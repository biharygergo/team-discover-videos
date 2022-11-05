import dynamic from "next/dynamic";
// const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const Video = dynamic(() => import("./index"), {
    ssr: false
  });

  
export default Video;