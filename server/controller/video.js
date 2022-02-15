const path = require("path");
const fs = require("fs-extra");
const shortid = require("js-shortid");
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffprobePath = require('@ffprobe-installer/ffprobe').path;
const { FFCreatorCenter } = require("ffcreator");

// 设置 FFmpeg 相关路径
FFCreatorCenter.setFFmpegPath(ffmpegPath);
FFCreatorCenter.setFFprobePath(ffprobePath);

module.exports = app => ({
  async making() {
    const { ctx, $service, $helper } = app;
    const uuid = shortid.gen() + new Date().valueOf();
    const folderId = ctx.request.body.folderId;
    const videoData = ctx.request.body.videoData;
    const taskId = FFCreatorCenter.addTask($service.video.createFFTask.bind(this, { videoData, uuid, folderId }));

    $helper.returnBody(true, { message: "ok", uuid, taskId });
  },

  async getProgress() {
    const { ctx, $service, $model, $helper } = app;
    const { taskId, uuid } = ctx.request.query;
    const publicpath = path.join(__dirname, "../public");

    let progress, state, file;
    // 重要: 是否是单server, 如果多机则读db
    const standAlone = true;
    if (standAlone) {
      progress = FFCreatorCenter.getProgress(taskId);
      state = FFCreatorCenter.getTaskState(taskId);
      file = FFCreatorCenter.getResultFile(taskId);
    } else {
      const result = $model.video.findOne({ uuid });
      progress = result.progress;
      state = result.state;
      file = result.file;
    }

    let videoUrl = file + "";
    videoUrl = videoUrl.replace(publicpath, "");
    $helper.returnBody(true, { message: "ok", taskId, progress, state, file, videoUrl });
  },

  async cacheClean() {
    const { $helper } = app;
    const videoDir = path.join(__dirname, "../public/resource/videos");
    const videocacheDir = path.join(__dirname, "../public/resource/images");
    const cacheDir = path.join(__dirname, "../cache/");
    await fs.emptyDir(videoDir);
    await fs.emptyDir(videocacheDir);
    await fs.emptyDir(cacheDir);

    $helper.returnBody(true, { message: "ok" });
  }
});
