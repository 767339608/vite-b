/*
 * @Author: zhangminhong zhangminhong@zhujia360.com
 * @Date: 2023-03-30 17:16:33
 * @LastEditors: zhangminhong zhangminhong@zhujia360.com
 * @LastEditTime: 2023-03-31 09:28:14
 * @FilePath: /zhujiayun-website-manage/Users/zhang/Desktop/zhang/vite-b/src/main.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale/zh_CN';
import './index.css'

let root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
  ,
)
