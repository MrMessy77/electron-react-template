const io = require('socket.io-client');
const BASE_URL = 'http://sub.cantocg.com/';

let socket;
let mainWindow;
// socket连接
const connect = (win) => {
    mainWindow = win;
    socket = io(`${BASE_URL}`, {
        query: {
            room: 'sxh'
        }
    });

    // 连接服务端
    socket.on('connect', () => {
        console.log('socketio #connect,');
    });

    // 接收通知
    socket.on('action', msg => {
        // console.log('#action,', msg);
        resolveAction(msg);
    });

    socket.on('disconnect', msg => {
        // console.log('#disconnect', msg);
    });

    socket.on('disconnecting', () => {
        // console.log('#disconnecting');
    });

    socket.on('error', () => {
        // console.log('socketio #error');

        if (socket) {
            socket = null;
        }

        setTimeout(() => {
            connect(win);
        }, 5000);
    });

    socket.on('close', () => {
        // console.log('socketio #close');

        if (socket) {
            socket = null;
        }

        setTimeout(() => {
            connect(win);
        }, 5000);
    });
}

// 解析通知信息
const resolveAction = (msg) => {
    const { action = '', data = {} } = msg;
    if (action === 'comment') {
        mainWindow.webContents.send('comment', data);
    }
}

module.exports = {
    connect
};
