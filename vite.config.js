import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'

// 模块、组件导入器，和element-plus代码解析器
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { viteMockServe } from 'vite-plugin-mock'

import path from 'node:path'

// ==================== 💡 DIFY 全局及路由配置 ====================
const DIFY_INFO = {
  host: "http://192.168.129.129:8080",
  urls: {
    agent: "/v1/chat-messages",
    chatFlow: "/v1/chat-messages",
    workFlow: "/v1/workflows/run" // 🌟 已修正：补全了标准的 /v1/ 前缀
  }
}

// ==================== 💡 业务应用配置（以后你只改这里就行） ====================
const DIFY_APP_INFO = {
  foodConsultant: {
    apiKey: 'Bearer app-rjVFNSerNFWDyJSO3ddBuIK8',
    type: 'chatFlow'
  },
  intelligentCommentGeneration: {
    apiKey: 'Bearer xxx',
    type: 'workFlow'
  },
  stallIntelligentAnalysis: {
    apiKey: 'Bearer xxx',
    type: 'workFlow'
  }
}


export default defineConfig({
  // 插件配置
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
  
  // 路径别名
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // 基地址
  base: "./",

  // Dify代理：解决跨域问题
  server: {
    host: '0.0.0.0', 
    port: 5173,      
    proxy: {
      // 拦截所有以 /dify-api 开头的请求
      '/dify-api': {
        target: DIFY_INFO.host,
        changeOrigin: true,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            try {
              // 解析请求中的 URL 参数
              const url = new URL(req.url, `http://${req.headers.host}`);
              const appName = url.searchParams.get('app'); 
              
              // 检查当前请求的应用是否存在于配置中
              if (appName && DIFY_APP_INFO[appName]) {
                const appConfig = DIFY_APP_INFO[appName];
                
                // 1. 动态注入对应的 ApiKey 和标头
                proxyReq.setHeader('Authorization', appConfig.apiKey);
                proxyReq.setHeader('Content-Type', 'application/json');
                
                // 2. 根据应用的 type，动态匹配 DIFY_INFO.urls 里的标准转发路径
                const targetPath = DIFY_INFO.urls[appConfig.type];
                
                if (targetPath) {
                  proxyReq.path = targetPath;
                } else {
                  console.warn(`\n[Vite 代理警告] 未在 DIFY_INFO.urls 中找到类型 [${appConfig.type}] 对应的路由映射\n`);
                }
              } else {
                console.warn(`\n[Vite 代理警告] 未在 DIFY_APP_INFO 中找到应用 [${appName}] 的配置信息\n`);
              }

            } catch (err) {
              console.error('[Vite 代理层发生严重错误]', err);
            }
          });
        }
      }
    }
  },

  // 打包的入口
  build: {
    rollupOptions: {
      input: {
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
        background: path.resolve(__dirname, 'background/index.html'),
      }
    }
  }
})