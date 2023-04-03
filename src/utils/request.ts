import axios, { AxiosResponse } from 'axios';
import { message } from 'ant-design-vue'

import { REQUEST_REFRESH_TOKEN } from '@/store/common'
import config from '@/config.default'
import store from '@/store';
import { navigatorRoute } from './utils';
const appKey = 'ZJY_cloudchoosehouse_gov' // 后端api 项目key
//在多少时间内允许重新刷新token,超出该时间直接调登录；单位为秒
//token最长有效时效两个小时，单位秒
const maxExpiresIn = config.loginPermissions.maxExpiresIn;

//过滤特定的接口地址，以下路径不进入重复取消队列
const API_whiteList = config.request.common.whiteList;

function BASE_URL() {
    if (process.env.CUSTOM_NODE_ENV === 'production') {
        return config.request.prefix.prod//线上
    } else if (process.env.CUSTOM_NODE_ENV === 'development') {
        return config.request.prefix.test //测试
    } else if (process.env.CUSTOM_NODE_ENV == 'safe') {
        return config.request.prefix.safe
    }
}


// axios 通用配置
const defaultConfigs = {
    baseURL: `${BASE_URL}`,
    timeout: 30000,
    validateStatus: function () {
        return true
    }
}

const redirectUrl = '/login'

let timestamp = Math.round(new Date().getTime() / 1000)

const request = axios.create(defaultConfigs);
const requestWithTokenDown = axios.create(defaultConfigs)


request.interceptors.request.use(async function (config) {
    config.headers.Accept = 'application/json'

    let token = JSON.parse(localStorage.getItem('token') || '{}') || {};
    let lastFetchedTime = parseInt(localStorage.getItem('lastFetchedTime') || '') || 0;
    let { accessToken, expiresIn, refreshToken, tokenType } = token;
    if (accessToken) {
        const timestamp = Math.floor(new Date().getTime() / 1000)

        //判断token是否已过期 authStore.expiresIn
        if ((timestamp - lastFetchedTime) > (expiresIn - 60)) { // 已过期
            // token 7天内未刷新允许重新获取token，如果超出7天直接跳登录
            if (((timestamp - lastFetchedTime) < maxExpiresIn) && API_whiteList.indexOf(config.url || '') === -1) {
                //同步刷新Token
                let newAuthData = await store.dispatch(REQUEST_REFRESH_TOKEN, refreshToken)
                newAuthData = newAuthData || {};
                config.headers.Authorization = `${newAuthData.tokenType} ${newAuthData.accessToken}`
            } else {
                //刷新接口本身不调用replace
                if (API_whiteList.indexOf(config.url || '') === -1) {
                    onModalClose()
                    navigatorRoute.replace({ name: redirectUrl })
                    // history.replace(redirectUrl)
                }
            }
        } else { // token 未过期
            config.headers.Authorization = `${tokenType} ${accessToken}`
        }
    } else {
        onModalClose()
        navigatorRoute.replace({ name: redirectUrl })
    }
    if (!config.data) {
        config.data = {}
    }
    config.data.appKey = appKey
    config.data.timestamp = timestamp
    return config
})
function onModalClose() {
    let root = document.getElementsByClassName('ant-modal-root')[0]
    if (root) {
        root.innerHTML = ''
    }
}


//code 过滤
const codeWhiteList = [
    81206
]

const responseInterceptor = <T>(response: AxiosResponse<any, T>) => {
    const { status, data } = response;
    if (status >= 200 && status < 500) {
        if (data.code === 1) {
            return Promise.resolve(data)
        }
        if (data.code == 10004) {
            onModalClose()
            navigatorRoute.replace({ name: redirectUrl })
            return Promise.resolve(data)
        }
        if (data.message === "访问令牌不能为空") {
            message.destroy()
            onModalClose()
            navigatorRoute.replace({ name: redirectUrl })
            return Promise.resolve(data)
        }
        message.destroy()
        !codeWhiteList.includes(data.code) && message.error(data.message || '网络错误')
        return Promise.reject(response)
    }
    message.destroy()
    !codeWhiteList.includes(data.code) && message.error(data && data.message || '服务器错误')
    return Promise.reject(response)

}
//下载request
requestWithTokenDown.interceptors.request.use((config) => {
    config.headers.Accept = 'application/json';
    let token = JSON.parse(localStorage.getItem('token') || '{}') || {};
    let { accessToken, tokenType } = token;
    config.headers.Authorization = `${tokenType} ${accessToken}`
    config.data == undefined ? config.data = {} : null
    config.data.appKey = appKey
    config.data.timestamp = timestamp

    return config
})
// 通用响应拦截器
const responseInterceptorDownLoad = <T>(response: AxiosResponse<any, T>) => {
    const { status, data } = response
    if (status >= 200 && status < 300) {
        return Promise.resolve(response)
    }
    message.error(data && data.data || '网络错误')
    return Promise.reject(response)

}

request.interceptors.response.use(responseInterceptor);
requestWithTokenDown.interceptors.response.use(responseInterceptorDownLoad);




export default request;

export {
    request,
    requestWithTokenDown
}