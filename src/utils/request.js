
export default function (config) {
    //在main.js调用时传入的参数
    const { baseURL } = config

    //请求数据中
    // uni.showLoading({
    //     title:"数据加载中...",
    //     mask:true
    // })
    //这个函数被Vue.use()调用
    return function (Vue) {

        //在vue的原型上面添加了一个request方法
        Vue.prototype.request = async function (params) {

            const { url , data , method , header } = params;

            //发送请求
            const res = await uni.request({
                url:baseURL + url,
                data,
                method,
                header
            });
            //拿到数据后
            // uni.hideLoading();
            return res[1].data;  //返回结果
         }

         
    }
}