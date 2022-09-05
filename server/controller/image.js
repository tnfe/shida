const { cloneDeep } = require("lodash");
const shortid = require("js-shortid");

module.exports = app => ({
  /**
   * 获取我的图片列表
   * @returns {Promise<void>}
   */
  async getMyImages() {
    const { $service, $helper } = app;
    const imageList = await $service.image.getMyImages();
    $helper.returnBody(true, imageList);
  },

  /**
   * 上传我的图片
   * @returns {Promise<void>}
   */
  async uploadImage() {
    const { ctx, $service, $helper } = app;
    const userData = ctx.userData;

    // 时间戳
    const timestamps = new Date().getTime().toString();
    const file = ctx.request.files.file;
    const folder = `images/${userData.username}/${timestamps}`;
    const fileResult = await $service.file.upload(file, folder);
    const imageData = await $service.image.addImage(fileResult.url);
    $helper.returnBody(true, imageData);
  },

  async uploadMultipleImages() {
    const { ctx, $service, $helper } = app;
    const sid = shortid.gen();
    const files = ctx.request.files;
    const body = ctx.request.body;
    const images = [];
    const uuid = ctx.request.body.id

    let folder = body.folder || `${sid}`;
    folder = `images/${uuid}/${folder}`
    for (let key in files) {
      const file = files[key];
      const index = key.replace("file", "");
      const data = body[`data${index}`];
      const { localPath, url } = await $service.file.fileUpload({ file, folder },uuid);
      images.push({ id: data, localPath, url });
    }

    $helper.returnBody(true, images);
  } ,

  //todo-模板上传
  async templateUploadMultipleImages() {
    const { ctx, $service, $helper } = app;
    const sid = shortid.gen();
    const files = ctx.request.files;
    const body = ctx.request.body;
    const images = [];
    const uuid = ctx.request.body.id

    let folder = body.folder || `${sid}`;
    //image有一个随机id的文件夹
    folder = `images/${uuid}/${folder}`
    for (let key in files) {
      const file = files[key];
      const index = key.replace("file", "");
      const data = body[`data${index}`];
      const { localPath, url } = await $service.file.fileUpload({ file, folder },uuid);
      images.push({ id: data, localPath, url });
    }

    $helper.returnBody(true, images);
  }

});
