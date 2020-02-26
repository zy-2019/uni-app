import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'


//导入一个模块
import request from './utils/request'

//调用request 函数后 得到一个新函数 

const plugin = request ({
  baseURL:'https://api-ugo-web.itheima.net'
})

Vue.use(plugin)

const app = new Vue({
  ...App
})
app.$mount()
