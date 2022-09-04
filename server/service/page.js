const lodash = require('lodash')
const fs = require('fs')
const path = require('path')

/**
 * 删除模板对应的资源文件夹文件夹
 * @param dir 文件夹目录
 */
function removeTemplateDir(dir) {
  if(fs.existsSync(dir)){
    let files = fs.readdirSync(dir)
    for (let i = 0; i < files.length; i++) {
      let newPath = path.join(dir, files[i])
      let stat = fs.statSync(newPath)
      if (stat.isDirectory()) {
        //如果是文件夹就递归下去
        removeTemplateDir(newPath)
      } else {
        //删除文件
        fs.unlinkSync(newPath)
      }
    }
    fs.rmdirSync(dir)//如果文件夹是空的，就将自己删除掉

  }
}

module.exports = app => ({
  /**
   * 获取我的页面列表
   * @returns {Promise<*>}
   */
  async getMyPages(pageMode, type) {
    const { ctx, $model } = app;
    let userData = ctx.userData;
    let query = { pageMode: pageMode, isTemplate: { $ne: true } };
    if (type === 'my') {
      query.author = userData._id;
    } else if (type === 'cooperation') {
      query.members = { $elemMatch: { $in: userData._id } };
    }

    return await $model.page
      .find(query)
      .select('_id title coverImage isPublish')
      .sort({ created: -1 })
      .exec();
  },

  /**
   * 获取我的页面数量
   * @returns {Promise<void>}
   */
  async getMyPagesCount(pageMode) {
    const { ctx, $model } = app;
    let userData = ctx.userData;
    let query = { author: userData._id, pageMode: pageMode, is_delete: { $ne: true }, isTemplate: { $ne: true } };
    return await $model.page.count(query);
  },
  /**
   * 获取我的协作页面数量
   * @returns {Promise<void>}
   */
  async getCooperationPagesCount(pageMode) {
    const { ctx, $model } = app;
    let userData = ctx.userData;
    let query = {
      members: { $elemMatch: { $in: userData._id } },
      pageMode: pageMode,
      is_delete: { $ne: true },
      isTemplate: { $ne: true },
    };
    return await $model.page.count(query);
  },
  /**
   * 获取我的模板列表
   * @param pageMode
   */
  async getMyTemplates(pageMode) {
    const { ctx, $model } = app;
    let userData = ctx.userData;
    let query = { author: userData._id, isTemplate: true };
    if (pageMode) {
      query.pageMode = pageMode;
    }
    return await $model.page
      .find(query)
      .select('_id title coverImage')
      .exec();
  },
  /**
   * 创建页面
   * @param pageData
   * @returns {Promise<*>}
   */
  async create(pageData) {
    const page = pageData;
    const { ctx, $model } = app;
    let userData = ctx.userData;
    delete pageData['__v'];
    delete pageData['created'];
    delete pageData['updated'];
    delete pageData.shareConfig;
    delete page['_id'];
    const res = lodash.pick(pageData,['name','templateId','title','description','coverImage','script','width','height','pages','isTemplate'])

    return await $model.page.create({
      ...res,
      author: userData._id,
    });
  },

  /**
   * 更新修改页面
   * @param pageData
   * @returns {Promise<*>}
   */
  async update(pageData) {
    const { $model } = app;
    return await $model.page.findOneAndUpdate(
      { _id: pageData._id },
      { $set: pageData },
      {
        runValidators: true,
      },
    );
  },

  /**
   * 彻底删除文档
   * @param id
   * @returns {Promise<boolean>}
   */
  async deletePage(id) {
    const { $model } = app;
    let imagesDir = path.join(__dirname, '..', '/public/resource/images', id)
    let filesDir = path.join(__dirname, '..', '/public/resource/files', id)
    let videosDir = path.join(__dirname, '..', '/public/resource/videos', id)
    removeTemplateDir(imagesDir)
    removeTemplateDir(filesDir)
    removeTemplateDir(videosDir)
    return await $model.page.remove({ _id: id });
  },

  /**
   * 获取页面详情
   * @param id
   * @returns {Promise<*>}
   */
  async getPageDetail(id) {
    const { $model } = app;
    return await $model.page.findById(id).exec();
  },

  /**
   * 发布页面
   * @param id
   * @returns {Promise<*>}
   */
  async setPublish(id) {
    const { $model } = app;
    return await $model.page.findByIdAndUpdate(id, { $set: { isPublish: true } });
  },

  /**
   * 通过user list 添加协作人
   * @param pageId
   * @param userIds
   * @returns {Promise<$addToSet.cooperation_user|{$each}|query.cooperation_user|{$elemMatch}>}
   */
  async addCooperationUser(pageId, userIds) {
    const { $model } = app;
    await $model.page.findByIdAndUpdate(pageId, {
      $addToSet: { members: { $each: userIds } },
    });
    let pageData = await $model.page
      .findOne({ _id: pageId })
      .populate({
        path: 'members',
        model: $model.user,
        select: 'name username _id email avatar',
      })
      .exec();
    pageData = pageData.toObject();
    return pageData.members;
  },

  /**
   * 获取协作人列表
   * @param pageId
   * @returns {Promise<RegExpExecArray>}
   */
  async getCooperationUserListByPageId(pageId) {
    const { $model } = app;
    let doc = await $model.page
      .findOne({ _id: pageId })
      .populate({
        path: 'members',
        model: $model.user,
        select: 'name username _id email avatar ',
      })
      .exec();
    doc = doc.toObject();
    return doc.members;
  },
  /**
   * 移出协作人
   * @param pageId
   * @param userId
   * @returns {Promise<*>}
   */
  async removeCooperationUser(pageId, userId) {
    const { $model } = app;
    return await $model.page.updateOne(
      { _id: pageId },
      { $pull: { members: userId } },
      {
        runValidators: true,
      },
    );
  },
  /**
   * 获取模板市场所有模板
   * @param pageMode
   * @returns {Promise<*>}
   */
  async getPublishTemplates(pageMode) {
    const { $model } = app;
    let query = { isPublish: true, isTemplate: true };
    if (pageMode) {
      query.pageMode = pageMode;
    }
    return await $model.page
      .find(query)
      .select('_id title coverImage')
      .exec();
  },
});
