const fs = require("fs-extra");
const path = require("path");
const shortid = require("js-shortid");

module.exports = app => ({
  async upload(file, folder = "images") {
    const { $config } = app;

    const fileData = fs.readFileSync(file.path);
    const folderPath = path.join(path.join(__dirname, "../public/resource/"), folder); // 拼接文件夹
    await fs.ensureDir(folderPath);

    const filePath = path.join(folderPath, file.name);
    fs.writeFileSync(filePath, fileData);

    return {
      fileName: file.filename,
      localPath: filePath,
      url: $config.baseUrl + `/resource/${folder}/${file.name}`
    };
  },

  async fileUpload({ file, folder = "images" },id) {
    const { $config } = app;
    const resource = path.join(__dirname, "../public/resource/");

    const fileData = fs.readFileSync(file.path);

    let folderPath = path.join(resource, folder,id)
    if(folder.includes('images')) {
      folderPath = path.join(resource, folder)
    }
    // console.log(folderPath)
    await fs.ensureDir(folderPath);

    const name = shortid.gen();
    const ext = file.name.split(".").pop();
    const fileName = `${name}.${ext}`;
    const filePath = path.join(folderPath, fileName);
    await fs.outputFile(filePath, fileData);
    let url = path.join($config.baseUrl || '', '/resource/', folder,id, fileName)
    if(folder.includes('images')) {
      url = path.join($config.baseUrl || '', '/resource/', folder, fileName)
    }

    return {
      fileName,
      localPath: filePath,
      url
    };
  }
});
