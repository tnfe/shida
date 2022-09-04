import { createUUID, deepClone } from '../../../common/uitls';
import { cloneDeep, merge, random, sortBy } from 'lodash';
import $config from '@client/config';

// 元素配置信息字段
let elementConfig = {
  elName: "", // 组件名
  animations: [], // 动画
  commonStyle: {
    position: "absolute",
    width: $config.canvasH5Width,
    height: 30,
    top: 200,
    left: 0,
    rotate: 0,
    paddingTop: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
    borderWidth: 0,
    borderColor: "",
    borderStyle: "solid",
    borderRadius: 0,
    boxShadow: "",
    fontSize: 16,
    fontWeight: 500,
    lineHeight: 1.4,
    letterSpacing: 0,
    textAlign: "center",
    color: "#000000",
    backgroundColor: "",
    backgroundImage: "",
    backgroundSize: "cover",
    opacity: 1,
    zIndex: 1
  }, // 公共样式
  events: [], // 事件
  propsValue: {}, // 属性参数
  value: "", // 绑定值
  valueType: "String",// 值类型
  //todo-新增字段
  tag: {
    text: [],
    type: 1
  }
};

// 页面配置信息字段
let pageConfig = {
  name: "",
  elements: [],
  commonStyle: {
    backgroundColor: "#044EC5",
    backgroundImage: "",
    backgroundSize: "cover"
  },
  data: {
    time: 2,
    duration: 6,
    trans: "WaterWave",
    transDuration: 1.5
  },
  config: {}
};

// 项目配置信息字段
let projectConfig = {
  name: "",
  title: "视搭视频",
  description: "我用视搭可视化编辑器做了一个超酷炫的视频，快来看看吧。",
  isTemplate:true,
  coverImage: "",
  author: "",
  script: "",
  width: $config.canvasH5Width,
  height: $config.canvasH5Height,
  pages: [],
  templateId:"",
};

let getElementConfig = function (element, extendStyle = {}) {
  let elementData = cloneDeep(element);
  let type = elementData.valueType || "String"; // 默认string类型
  let dict = {
    Sting: "",
    Array: [],
    Object: {},
    Boolean: false,
    Number: 0
    // 待扩展数据类型
  };
  let elementConfigData = cloneDeep(elementConfig);
  let config = {
    uuid: createUUID(),
    ...elementConfigData,
    elName: elementData.elName,
    propsValue: deepClone(elementData.needProps || {})
  };
  // 样式
  config.commonStyle = merge(config.commonStyle, elementData.defaultStyle);
  config.commonStyle = merge(config.commonStyle, extendStyle);
  config.tag = cloneDeep(elementConfigData.tag)
  config.value = element.defaultValue || dict[type];
  config.valueType = type;
  return config;
};

let copyElement = function (element, extendStyle = {}, type = "element") {
  element = cloneDeep(element);
  element.uuid = createUUID();
  element.commonStyle = merge(element.commonStyle, extendStyle);
  if (type === "element") {
    // 加上一点偏移量，以作区分
    element.commonStyle.top = element.commonStyle.top + 10;
    element.commonStyle.left = element.commonStyle.left + 10;
  }
  return element;
};

let getPageConfig = function () {
  return {
    uuid: createUUID(),
    ...cloneDeep(pageConfig)
  };
};
let copyPage = function (data) {
  let pageData = cloneDeep(data);
  pageData.uuid = createUUID();
  pageData.elements = pageData.elements.map(element => {
    return copyElement(element, {}, "page");
  });
  return pageData;
};

let getProjectConfig = function () {
  let project = cloneDeep(projectConfig);
  let onePage = getPageConfig();
  project.pages.push({
    ...onePage
  });
  return {...project};
};

/**
 * 获取元素样式
 * @param styleObj
 * @param scalePoint 缩放比例
 */
let getCommonStyle = function (styleObj, scalingRatio = 1) {
  let needUnitStr = [
    "width",
    "height",
    "top",
    "left",
    "paddingTop",
    "paddingLeft",
    "paddingRight",
    "paddingBottom",
    "marginTop",
    "marginLeft",
    "marginRight",
    "marginBottom",
    "borderWidth",
    "fontSize",
    "borderRadius",
    "letterSpacing"
  ];
  let style = {};

  for (let key in styleObj) {
    if (needUnitStr.includes(key)) {
      style[key] = styleObj[key] * scalingRatio + "px";
    } else {
      style[key] = styleObj[key];
    }
  }
  style.transform = `rotate(${style.rotate}deg)`;
  style.backgroundImage = style.backgroundImage ? `url(${style.backgroundImage})` : "";
  return style;
};

const getDataByKeyFromVideoData = (videoData, key) => {
  for (let i = 0; i < videoData.pages.length; i++) {
    const page = videoData.pages[i];
    for (let j = 0; j < page.elements.length; j++) {
      const element = page.elements[j];
      if (element.isFFImage && element.key === key) {
        return element;
      }
    }
  }

  return null;
};

const cloneToVideoData = projectData => {
  const videoData = {};
  const {title, fps = 30, width, height} = projectData;
  videoData.title = title;
  videoData.fps = fps;
  videoData.width = width;
  videoData.height = height;
  videoData.pages = [];
  videoData.audio = getMusicAudio(projectData);

  for (let i = 0; i < projectData.pages.length; i++) {
    const page = projectData.pages[i];
    const data = page.data;
    data.backgroundColor = page.commonStyle.backgroundColor || "#000000";
    videoData.pages.push({
      data,
      elements: []
    });
  }
  
  return videoData;
};

const getMusicAudio = projectData => {
  let music;
  for (let i = 0; i < projectData.pages.length; i++) {
    const page = projectData.pages[i];
    for (let j = 0; j < page.elements.length; j++) {
      const element = page.elements[j];
      if (element.elName === "qk-bg-music") {
        music = element.propsValue.musicSrc;
      }
    }
  }

  return music;
};

//修改不同标签的propsValue
const getPropsAttrValue = elName => {
  let propsValue
  switch (elName) {
    case 'qk-image':
      propsValue = 'imageSrc'
      break;
    case 'qk-video':
      propsValue = 'videoSrc'
      break;
    case 'qk-text':
      propsValue = 'text'
      break;
    case 'qk-rectangle-border':
      propsValue = 'bgColor'
      break;
    case 'qk-image-carousel':
      propsValue = 'imageSrcList'
      break;
    case 'qk-bg-music':
      propsValue = 'musicSrc'
      break;
  }
  return propsValue
}


//todo-随机一个替换资源

const instancePath = '/static/demo素材/'
const resourceDemoPathFront = '@server/public/static/demo素材/'
const getRandomResource = (path) => {
  let files
  // if (path === "门头") {
  //   files = require.context('@server/public/static/demo素材/门头', false, /mp4$/).keys();
  // } else if (path === "店内") {
  //   files = require.context('@server/public/static/demo素材/店内', false, /mp4$/).keys();
  // }
  let filePath = ""
  if (files) {
    const randomIndex = random(0, files.length, false)
    filePath = files[randomIndex]
  }

  // console.log("filePath:",filePath)
  return filePath

}
// 删掉音乐元素,并且按照z-index重新排序
const processingProjectData = (projectData) => {

  const newData = deepClone(projectData);

    for (let i = 0; i < newData.pages.length; i++) {
      const page = newData.pages[i];
      for (let element of page.elements) {
        const text = [...element.tag.text]
        if (element.tag.text.length > 0) {
          let propsAttrName
          propsAttrName = getPropsAttrValue(element.elName)

    page.elements = sortBy(page.elements, o => o.commonStyle.zIndex);
    for (let j = page.elements.length - 1; j >= 0; j--) {
      const element = page.elements[j];
      if (element.elName === "qk-bg-music") {
        page.elements.splice(j, 1);
      }
    }
          const randomResource = getRandomResource(text[0])
          // if (!randomResource) {
          //   element.propsValue[propsAttrName] = `${instancePath}${text[0]}/${randomResource}`
          // }
          // console.log(randomResource)
        }
      }

      page.elements = sortBy(page.elements, o => o.commonStyle.zIndex);
      for (let j = page.elements.length - 1; j >= 0; j--) {
        const element = page.elements[j];
        if (element.elName === "qk-bg-music") {
          page.elements.splice(j, 1);
        }
      }
    }



  // console.log(componentType)
  return newData;
};

export default {
  elementConfig,
  pageConfig,
  projectConfig,
  getElementConfig,
  getPageConfig,
  getProjectConfig,
  copyPage,
  copyElement,
  getCommonStyle,
  cloneToVideoData,
  processingProjectData,
  getDataByKeyFromVideoData
};


