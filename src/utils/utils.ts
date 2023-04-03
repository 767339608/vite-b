/*
 * @Author: zhangminhong zhangminhong@zhujia360.com
 * @Date: 2023-03-03 11:01:11
 * @LastEditors: zhangminhong zhangminhong@zhujia360.com
 * @LastEditTime: 2023-03-30 17:21:56
 * @FilePath: /zhujiayun-website-manage/Users/zhang/Desktop/zhang/vite-b/src/utils/utils.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import config from '@/config.default'
function BASE_URL() {
    if (process.env.CUSTOM_NODE_ENV === 'production') {
        return config.request.prefix.prod//线上
    } else if (process.env.CUSTOM_NODE_ENV === 'development') {
        return config.request.prefix.test //测试
    } else if (process.env.CUSTOM_NODE_ENV == 'safe') {
        return config.request.prefix.safe
    }
}

//页面自适应
export function setmultiple() {
    let innerWidth = window.innerWidth;
    let innerHeight = window.innerHeight;
    let radioWidth = innerWidth / 1920;
    let radioHeight = innerHeight / 1080;
    let multiple = radioHeight > radioWidth ? radioWidth : radioHeight;
    console.log(multiple)
    document.body.style.setProperty("--multiple", String(multiple));
}
