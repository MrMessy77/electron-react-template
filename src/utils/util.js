import fs from "fs"
import path from "path"
import jschardet from "jschardet"
import iconv from 'iconv-lite'

//文件是否存在
export const existsSync = (url) => {
  let _path = path.join(__static, url);
  return fs.existsSync(_path) ? true : false;
}

//获取本地JSON数据
export const getLocalJSON = (url) => {
  let _path = path.join(__static, url)
  let result
  if (fs.existsSync(_path)) {
    result = JSON.parse(fs.readFileSync(_path));
  }
  return result;
}

//读取txt文档 
export const readTxt = (filepath) => {
  let _path = path.join(__static, filepath);
  let result
  if (fs.existsSync(_path)) {
    result = fs.readFileSync(_path);
    const info = jschardet.detect(result)
    if (info.encoding == "UTF-8") {
      result = iconv.decode(result, 'utf-8');
    } else if (info.encoding == "GB2312" || info.encoding == "ascii") {
      result = iconv.decode(result, 'gbk');
    }
  }
  return result;
}

//读取文件夹下文件信息
export const readDir = (filepath) => {
  let _dirpath = path.join(__static, filepath);
  let fileList = fs.readdirSync(_dirpath);

  let result = [];
  fileList.forEach(file => {
    if (!file.match(/(.DS_Store)/)) {
      result.push(file);
    }
  });

  return result;
}