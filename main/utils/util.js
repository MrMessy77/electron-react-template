const fs = require("fs");
const { join } = require("path");

// 读取文件内容
const readFile = (path) => {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path);
  }
  return null;
}

// 获取Static文件下JSON文件数据
const getStaticJSON = (path) => {
  let result;
  let _path = join(__dirname, `../../dist/static/${path}`);
  result = readFile(_path);
  if (result) {
    return JSON.parse(result);
  }
  return null;
}

module.exports = {
  readFile,
  getStaticJSON
}