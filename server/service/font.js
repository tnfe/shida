const fs = require('fs');
const request = require('request');

/**
 * 下载文件
 * @param uri
 * @param filename
 * @param callback
 */
async function downloadFile(uri, filename, callback) {
  const stream = fs.createWriteStream(filename);
  await request(uri).pipe(stream).on('close', callback);
}

module.exports = app => ({

  /**
   * 初始化字体
   */
  async initFonts() {
    let fontList = [];
    //1.调用接口
    const options = {
      url: 'https://apitest.yuantaikeji.com/parse0/classes/SystemSetting?where={"type":2}',
      headers: {
        'X-Parse-Application-Id': 'myAppId0',
      },
    };
    function callback(err, response, body) {
      if (!err && response.statusCode === 200) {
        //todoJSON.parse(body)
        const res = JSON.parse(body);
        fontList = [...res.results];
        //2.查本地文件
        const allFontFilePath = fs.readdirSync('./client/common/text-fonts/src');
        //3.和接口结果对比
        for (let i = 0; i < fontList.length; i++) {
          const remoteFont = fontList[i];
          if (!allFontFilePath.includes(remoteFont.fileName)) {
            console.log("开始下载字体");

            for (let j = 0; j < 1; j++) {
              //需要下载的url-转码
              const fileUrl = `https://apitest.yuantaikeji.com/system/font/${encodeURI(remoteFont.link.split('/')[remoteFont.link.split('/').length - 1])}`;
              //需要下载的文件名
              const fileName = `./client/common/text-fonts/src/${remoteFont.fileName}`;
              //4.下载有差异的文件
              downloadFile(fileUrl, fileName, function(err) {
                if (!err) {
                  console.log(`${remoteFont.link.split('/')[remoteFont.link.split('/').length - 1]}:下载完成`);
                  //5.再次读取文件列表并清空里面的内容
                  const newFontFileArray = fs.readdirSync('./client/common/text-fonts/src');
                  let content = [];
                  fs.writeFileSync('./client/common/text-fonts/index.css', '');

                  //6.写入.css文件(font-face)
                  // windows换行 \r\n  linux换行\n  mac换行 \r
                  for (let k = 0; k < newFontFileArray.length; k++) {
                    const oldFontFace = fs.readFileSync('./client/common/text-fonts/index.css', 'utf8');
                    const newFontFile = newFontFileArray[k];
                    const newFontName = newFontFileArray[k].split('.')[0];
                    if (oldFontFace.indexOf(newFontFile) === -1) {
                      content = `
@font-face {
    font-family: "${newFontName}";
    src: url('./src/${newFontFile}');
    font-weight: normal;
    font-style: normal;
} \r\n
`;
                      fs.writeFileSync('./client/common/text-fonts/index.css', content, { flag: 'a+' });
                    }
                  }

                } else {
                  throw err;
                }
              });
            }
          }
        }
      }
    }

    // await request(options, callback);


  },

});
