import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'


//模块、组件导入器，和element-plus代码解析器
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

import path from 'node:path';



// https://vite.dev/config/
export default defineConfig({
  //插件
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    viteMockServe({
      mockPath: 'mock', 
      localEnabled: true, // 开发环境启用mock
    })
  ],
  //路径别名(只对import生效，可以生成相对路径)
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  //基地址（将项目部署到哪个子目录，设置‘./‘可以部署到任意目录）
  base:"./",

  //打包的入口
  build:{
    rollupOptions:{
      input:{
        home: path.resolve(__dirname, 'home.html'),
        foodReview: path.resolve(__dirname, 'foodReview.html'),
        stall: path.resolve(__dirname, 'foodReview/stall.html'),
        comment: path.resolve(__dirname, 'foodReview/stall/comment.html'),
        dish: path.resolve(__dirname, 'foodReview/stall/dish.html'),
        editPassword: path.resolve(__dirname, 'user/editPassword.html'),
        login: path.resolve(__dirname, 'user/login.html'),
        myComment: path.resolve(__dirname, 'user/myComment.html'),
        personalInfo: path.resolve(__dirname, 'user/personalInfo.html'),
        signUp: path.resolve(__dirname, 'user/signUp.html'),
      }
    }
  }
})
