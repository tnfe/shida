const path = require("path");
const fs = require("fs-extra");

const dist = path.join(__dirname, "../dist");
const static = path.join(__dirname, "../server/public/static");
const public = path.join(__dirname, "../server/public");

fs.ensureDir(public).then(() => {
  beginCloneFile(clone);
}).catch(err => {
  console.error(err);
});

function beginCloneFile(callback) {
  fs.readdir(public, (err, files) => {
    files?.forEach(file => {
      if (
        /[0-9]{1,10}/gi.test(file) ||
        /.*update\.(json|js)$/gi.test(file) ||
        file === "index.js" ||
        file === ".DS_Store" ||
        file === "favicon.ico"
      ) {
        fs.removeSync(path.join(public, file));
      }
    });

    fs.emptyDir(static);
    callback();
  });
}

async function clone() {
  await fs.copy(dist, public);
  console.log("拷贝完毕");
}
