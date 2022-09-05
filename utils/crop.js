const ffmpeg = require("fluent-ffmpeg");

/**
 * 图片或视频按中心裁切
 * @param inputVideoPath 输入视频文件路径
 * @param targetWidth 目标宽度
 * @param targetHeight 目标长度
 * @param outputVideoPath 输出视频文件路径 -- 注意加上文件名及格式
 * @returns {Promise<unknown>}
 */
async function cropVideoByCenter(inputVideoPath, targetWidth, targetHeight, outputVideoPath) {
  return new Promise((res, rej) => {
    ffmpeg()
      .input(inputVideoPath)
      // .format('mp4')
      .videoFilters([
        {
          filter: 'crop',
          options: {
            w: targetWidth,
            h: targetHeight
          }
        }
      ])
      .output(outputVideoPath)
      .on('start', function (commandLine) {
        console.log('cropVideoByCenter执行命令: ' + commandLine)
        console.log('cropVideoByCenter开始裁剪:', outputVideoPath)
      })
      .on('progress', function (progress) {
        console.log(progress)
      })
      .on('error', function (err) {
        console.log('cropVideoByCenter出错了')
        rej(err)
      })
      .on('end', function () {
        console.log('cropVideoByCenter结束:', outputVideoPath)
        res(outputVideoPath)
      })
      .run()
  })
}

/**
 * 获取视频的宽高
 * @param media 视频路径
 * @returns {Promise<unknown>}
 */
async function getDimension(media) {
  console.log('Getting Dimentions from:', media)
  return new Promise((res, rej) => {
    ffmpeg.ffprobe(media, async function (err, metadata) {
      if (err) {
        console.log('Error occured while getting dimensions of:', media)
        rej(err)
      }
      // console.log(metadata.streams[0].width)
      // console.log(metadata)
      res({
        width: metadata.streams[0].width,
        height: metadata.streams[0].height
      })
    })
  })
}

/**
 * 改变视频尺寸 填充视频
 * @param originVideo 原始的视频
 * @param targetWidth 目标宽
 * @param targetHeight 目标高
 * @param outputPath 输出的文件路径 -- 带上文件名
 * @param autoPad
 * @param padColor 填充颜色
 * @returns {Promise<unknown>}
 */
function resizeVideoByCenter(originVideo, targetWidth, targetHeight, outputPath, autoPad = false, padColor) {
  return new Promise((res, rej) => {
    //设置输出帧的大小
    let ff = ffmpeg()
      .input(originVideo)
      .size(`${targetWidth}x${targetHeight}`)

    //autoPad: boolean
    autoPad ? (ff = ff.autoPad(autoPad, padColor)) : null

    ff.output(outputPath)
      .on('start', function (commandLine) {
        console.log('Spawned resizingVideo with command: ' + commandLine)
        console.log('Start resizingVideo:', originVideo)
      })
      // .on("progress", function(progress) {
      //   console.log(progress);
      // })
      .on('error', function (err) {
        console.log('Problem performing resizingVideo function')
        rej(err)
      })
      .on('end', function () {
        console.log('End resizingVideo:', outputPath)
        res(outputPath)
      })
      .run()
  })
}

/**
 * 生成按照比例缩放的视频
 * @param originVideo 初始的视频路径
 * @param targetWidth 目标宽
 * @param targetHeight 目标高
 * @param outputPath 输出路径
 * @returns {Promise<unknown>}
 */
async function scaleVideoByCenter(originVideo, targetWidth, targetHeight, outputPath) {
  // const output = 'scaledOutput.mp4'
  const {
    width,
    height
  } = await getDimension(originVideo)

  //如果原视频的宽高比 大于 目标宽高比 --
  if ((width / height).toFixed(2) > (targetWidth / targetHeight).toFixed(2)) {
    // y=0 case
    // landscape to potrait case
    const x = width - (targetWidth / targetHeight) * height
    console.log(`New In trim Res: ${width - x}x${height}`)
    // const cropping = 'tempCropped-' + output
    let cropped = await cropVideoByCenter(
      originVideo,
      width - x,
      height,
      outputPath
    )
    return await resizeVideoByCenter(cropped, targetWidth, targetHeight, outputPath)
  } else if ((width / height).toFixed(2) < (targetWidth / targetHeight).toFixed(2)) {
    //当原视频的宽高比 小于 目标宽高比 -- 需要填充
    return await resizeVideoByCenter(originVideo, targetWidth, targetHeight, outputPath, true)
  } else {
    return await resizeVideoByCenter(originVideo, targetWidth, targetHeight, outputPath)
  }
}

module.exports = {
  scaleVideoByCenter
}
