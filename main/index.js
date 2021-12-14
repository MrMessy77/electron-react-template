const { app, ipcMain } = require('electron');
const { MainWin } = require("./win/main");
const { connect } = require('./core/socketio');
const Socket = require('./core/socket');
const { getStaticJSON } = require('./utils/util');

let config = getStaticJSON('config.json');
let mainWin = new MainWin(config.base);
let socket; //socket

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }

  if (socket) {
    socket.destory();
    socket = undefined;
  }
})

module.exports = () => {
  app.whenReady().then(() => {
    mainWin.create();

    // 连接socketio
    connect(mainWin.win);

    //连接socket
    let socketConf = config.socket;
    if (socketConf && socketConf.open) {
      socket = new Socket();
      socket.start(socketConf, mainWin.win);
    }
  });
}