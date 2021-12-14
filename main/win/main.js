const { BrowserWindow } = require('electron');
const path = require('path');

class MainWin {
  constructor(winConf = {}) {
    this.win = undefined;
    this.winURL = process.env.NODE_ENV === 'development'
      ? `http://localhost:9080`
      : `file://${path.resolve(__dirname, '../../dist/index.html')}`;
      this.winConf = winConf;

      if (process.env.NODE_ENV === 'development' || winConf.openDevTools) {
        this.winConf = {
          ...this.winConf,
          width: winConf.width,
          height: winConf.height
        }
      } else {
        this.winConf = {
          ...this.winConf,
          fullscreen: true,
          isAlwaysOnTop: true,
        }
      }
  }

  create() {
    const { winURL } = this;
    this.win = new BrowserWindow({
      ...this.winConf,
      useContentSize: true,
      autoHideMenuBar: true,
      resizable: false,
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false
      }
    });

    // 开启调试模式
    if (this.winConf.openDevTools || process.env.NODE_ENV === 'development') {
      this.win.webContents.openDevTools();
    }

    this.win.loadURL(winURL);
  }
}

module.exports = { MainWin }