const net = require('net');
const { ipcMain } = require('electron');

///
/// socket 接口通信
///
class Socket {

  mainWindow = null;
  client = undefined;
  connStatus = 0; //0 未连接 1 连接中 2 已连接

  constructor() {
  }

  /**
   * 连接socket
   */
  start(socketConf, mainWindow) {
    if (!this.mainWindow) {
      this.mainWindow = mainWindow;
    }

    if (socketConf && socketConf.open) {
      this.client = new net.Socket();
      this.client.setEncoding('binary');
      this.connect(socketConf.port, socketConf.host, socketConf.cmd);
      this.client.on('data', (data) => {
        //得到服务端返回来的数据
        console.log("socket info: socket获得信息 " + data)
        this.doCmd(data)
      });
      this.client.on('error', (error) => {
        //错误出现之后关闭连接
        console.log("socket info: socket错误  " + error)
      });
      this.client.on('close', () => {
        //正常关闭连接
        this.connStatus = 0
        console.log("socket info: socket已关闭")
        this.client = undefined
        let timer = setTimeout(() => {
          this.start(socketConf, mainWindow)
          clearTimeout(timer)
          timer = undefined
        }, 3000)
      });
      this.client.on('end', () => {
        console.log("socket info: socket连接断开")
      });
      this.client.on('timeout', () => {
        console.log("socket info: socket连接超时")
        this.client.end()
        this.client = undefined
      });
    }
  }

  /**
   * 开始连接
   * @param {*} port 
   * @param {*} host 
   */
  connect(port, host, cmd) {
    if (this.connStatus === 0) {
      console.log("socket info: socket正在连接")
      this.client.connect(port, host, () => {
        //向端口写入数据到达服务端
        this.connStatus = 2
        console.log("socket info: socket已连接")
        this.send(cmd.reg)
        this.registerIpcMain(cmd.extend)
      });
      this.connStatus = 1
    }
  }

  /**
   * 向服务器发送信息
   * @param {*} msg 
   */
  send(msg) {
    if (this.connStatus === 2 && this.client) {
      this.client.write(msg);
    }
  }

  /**
   * 销毁实例
   */
  destory() {
    if (this.connStatus !== 0 && this.client) {
      this.client.end()
      this.client = undefined
      this.connStatus = 0;
    }
  }

  /**
 * 处理命令
 * @param {*} cmd 
 */
  doCmd(cmd) {
    if (cmd.indexOf('type') !== -1) {
      let type = cmd.split('=')[1];
      this.mainWindow.webContents.send('changeMode', Number(type));
    }
  }

  /**
   * 注册信息
   */
  registerIpcMain(cmdArr) {
    cmdArr.forEach(d => {
      ipcMain.on(d.evt, (e, msg) => {
        let _cmd = d.cmd
        if (d.target) {
          _cmd = d.target + "_" + msg
        }
        if (_cmd == undefined) {
          _cmd = msg
        }
        this.send(_cmd)
      })
    })
  }
}

module.exports = Socket;