import axios from 'axios'
import qs from 'qs'
import config from '../common/config';

const service = axios.create({
  baseURL: config.BASE_URL,
  timeout: 30000 // 请求超时时间
})

// 请求错误处理函数
const err = (err) => {
  return Promise.reject(err)
}

service.interceptors.request.use(config => {
  if (config.headers['Content-Type'] !== 'multipart/form-data') {
    if (['post', 'put'].includes(config.method)) {
      config.data = qs.stringify({ ...config.data })
    }
  }
  return config
}, err)

service.interceptors.response.use(response => {
  const resData = response.data || {}

  if (resData.error === 0) {
    return resData.data || null
  } else {
    let errStr
    const errormsg = resData.msg
    const errorno = resData.error
    const errormsgType = typeof errormsg

    if (errormsgType === 'string') {
      errStr = `errorMsg: ${errormsg}`
    } else if (errormsgType === 'object') {
      errStr = `errorMsg: ${JSON.stringify(errormsg)}`
    }

    if (typeof errorno === 'number') {
      errStr += ` errorno: ${errorno}`
    }

    return Promise.reject(new Error(errStr))
  }
}, err)

export {
  service as axios
}