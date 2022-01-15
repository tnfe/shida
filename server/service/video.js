const path = require("path");
const fs = require("fs-extra");
const { isEmpty, forEach } = require("lodash");
const { FFRect, FFScene, FFImage, FFText, FFGifImage, FFVideo, FFAlbum, FFCreator } = require("ffcreator");

const font = path.join(__dirname, "../public/static/demo/wryh.ttf");

// 添加对应类型组件
const addComponent = element => {
  let comp, url;
  const { left = 0, top = 0, width, height } = element.commonStyle || {};
  const x = left + width / 2;
  const y = top + height / 2;
  const commomStyle = { x, y, width, height };

  const getNetPath = url => {
    if (/^(http|https|www)/gi.test(url)) return url;
    if (/^(\/static|static|\/resource|resource)/gi.test(url)) return path.join(__dirname, "../public", url);
    return path.join(__dirname, "../public/resource", url);
  };

  const getImgPath = propsValue => {
    const { localPath, imageSrc } = propsValue;
    if (localPath) return localPath;
    return getNetPath(imageSrc);
  };

  switch (element.elName) {
    case "qk-image":
      url = getImgPath(element.propsValue);
      comp = new FFImage({ path: url, ...commomStyle });
      break;

    case "qk-rectangle-border":
      const color = element.propsValue.bgColor;
      comp = new FFRect({ color, ...commomStyle });
      break;

    case "qk-text":
      const text = element.propsValue.text;
      comp = new FFText({ text, ...commomStyle });
      comp.setStyle(element.commonStyle);
      comp.setFont(font);
      comp.setAnchor(0.5);
      comp.alignCenter();
      break;

    case "qk-video":
      url = getNetPath(element.propsValue.videoSrc);
      comp = new FFVideo({ path: url, ...commomStyle });
      break;

    case "qk-image-carousel":
      const list = element.propsValue.imageSrcList.map(x => getImgPath({ imageSrc: x }));
      comp = new FFAlbum({ list, showCover: true, ...commomStyle });
      comp.setTransition("zoomIn");
      comp.setDuration(1);
      break;
  }

  if (!isEmpty(element.animations)) {
    forEach(element.animations, ani => {
      const { type, duration = 1, delay = 1 } = ani;
      comp.addEffect(type, duration, delay);
    });
  }

  return comp;
};

const cleanCacheFolder = async folderId => {
  const cacheDir = path.join(__dirname, "../public/resource/images", `${folderId}`);
  await fs.emptyDir(cacheDir);
  await fs.remove(cacheDir);
};

// 服务类
module.exports = app => ({
  async createFFTask({ videoData, folderId, uuid }) {
    const { ctx, $model } = app;
    const { width, height, fps, audio } = videoData;

    const outputDir = path.join(__dirname, "../public/resource/videos");
    const cacheDir = path.join(__dirname, "../cache/");
    const localAudio = audio ? path.join(__dirname, "../public", audio) : null;

    const creator = new FFCreator({
      cacheDir,
      outputDir,
      width,
      height,
      fps,
      audio: localAudio,
      debug: false,
      parallel: 8
    });

    for (let i = 0; i < videoData.pages.length; i++) {
      const page = videoData.pages[i];
      const { duration, transDuration, trans, backgroundColor } = page.data;

      const scene = new FFScene();
      scene.setBgColor(backgroundColor);
      scene.setDuration(duration);
      scene.setTransition(trans, transDuration);
      creator.addChild(scene);

      for (let j = 0; j < page.elements.length; j++) {
        const element = page.elements[j];
        const comp = addComponent(element);
        if (comp) scene.addChild(comp);
      }
    }
    creator.start();
    //creator.openLog();

    let videoDB;
    let index = 0;
    creator.on("start", () => {
      console.log(`FFCreator start`);
      videoDB = $model.video.create({ uuid });
    });

    creator.on("error", e => {
      cleanCacheFolder(folderId);
      console.log(`FFCreator error: ${e.error}`);
    });

    creator.on("progress", e => {
      const percent = (e.percent * 100) >> 0;
      if (index % 3 === 0) {
        const { _id } = videoDB;
        $model.video.updateOne({ _id }, { $set: { percent } });
      }

      console.log(`FFCreator progress: ${percent}%`);
      index++;
    });

    creator.on("complete", e => {
      cleanCacheFolder(folderId);
      const { _id } = videoDB;
      const file = e.output;
      $model.video.updateOne({ _id }, { $set: { state: "complete", file } });
      console.log(`FFCreator completed: \n USEAGE: ${e.useage} \n PATH: ${file} `);
    });

    return creator;
  }
});
