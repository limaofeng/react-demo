// export const api = 'http://192.168.0.200:8000';
// const config = require('./../../../lib/config');

const config = {
    production: {
        serverPath: process.env.SERVER_PATH || 'https://api.zbsg.com.cn',
        picturePath: process.env.PICTURE_PATH || 'https://img.zbsg.com.cn',
        napi: process.env.NAPI_PATH || 'https://admin.zbsg.com.cn',
        wxPath: process.env.WX_PATH || 'https://wx.zbsg.com.cn',
        webPath: process.env.WEB_PATH || 'https://www.zbsg.com.cn',
        jtPath: process.env.TEAM_PATH || 'https://jt.zbsg.com.cn',
        wsapi: process.env.WSAPI || 'wss://api.zbsg.com.cn',
        mallPath: '',
        payPath: ''
    },
    test: {
        serverPath: process.env.SERVER_PATH || 'http://114.55.142.155:8000',
        picturePath: process.env.PICTURE_PATH || 'http://114.55.142.155:8086',
        napi: process.env.NAPI_PATH || 'http://v2.zbsg.com.cn:5005',
        wxPath: process.env.WX_PATH || 'http://v2.zbsg.com.cn:5030',
        webPath: process.env.WEB_PATH || 'http://v2.zbsg.com.cn:5020',
        jtPath: process.env.TEAM_PATH || 'http://v2.zbsg.com.cn:5000',
        wsapi: process.env.WSAPI || 'ws://114.55.142.155:8090',
        mallPath: 'http://114.55.142.155:8089',
        payPath: 'http://114.55.142.155:8082'
    },
    development: {
        serverPath: 'http://dev.zbsg.com.cn',
        picturePath: 'http://dev.zbsg.com.cn:8086',
        napi: 'http://localhost:3000',
        wxPath: 'http://v2.zbsg.com.cn:5030',
        webPath: 'http://localhost:3010',
        jtPath: 'http://v2.zbsg.com.cn:5000',
        wsapi: 'ws://dev.zbsg.com.cn:8090',
        mallPath: 'http://116.62.193.57:8089',
        payPath: 'http://116.62.193.57:8082'
    }
};

const x = (() => {
    if (config[process.env.NODE_ENV]) return config[process.env.NODE_ENV];
    return config.development;
})();

export const api = x.serverPath;
export const picturePath = x.picturePath;
export const napi = x.napi;
export const wsapi = x.wsapi;
export const wxPath = x.wxPath;
export const webPath = x.webPath;
export const jtPath = x.jtPath;
export const mallPath = x.mallPath;
export const payPath = x.payPath;
