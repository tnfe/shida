import Text from "./text";
import imageSrc from "./imageSrc";
import Interval from "./interval";
import videoSrc from "./videoSrc";
import imageSrcList from "./imageSrcList";
import Url from "./url";
import bgColor from "./bgColor";
import musicSrc from "./musicSrc";

export default {
  [Text.name]: Text,
  [Interval.name]: Interval,
  [imageSrc.name]: imageSrc,
  [videoSrc.name]: videoSrc,
  [Url.name]: Url,
  [musicSrc.name]: musicSrc,
  [bgColor.name]: bgColor,
  [imageSrcList.name]: imageSrcList
};
