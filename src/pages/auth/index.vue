<template>
  <view>
    <button type="primary" open-type="getUserInfo" @getuserinfo="getInfo">微信登录</button>
  </view>
</template>

<script>
  export default {
    data(){
      return {

      }
    },

    methods:{

      getInfo(res){   

        this.getToken(res.detail)  //用户信息

        console.log(res);
        
      },
      //获取token信息
     async getToken(res){

       //cade信息
       const [err,codeObj] = await uni.login();

        const {message} = await this.request({
          url:"/api/public/v1/users/wxlogin",
          method:"POST",
          data:{
            code:codeObj.code,
            encryptedData:res.encryptedData,
            iv:res.iv,
            rawData:res.rawData,
            signature:res.signature
          }
        });
        console.log(message);
        
        // 4.token获取到：存入本地
        uni.setStorageSync("token",message.token);

        // 5.返回去  路由 ：上一页；当时校验的时候，没有token;
        uni.navigateBack();
      }
    },
   async onLoad(){
      // 1.获取用户信息
      // 1.1 先用 API js 方法  uni封装promise返回 [err, res]
      const [err,res] = await uni.getUserInfo();

      //  1.2 res没有数据 用户没有授权：让用户主动授权；
      if (!res) {
        return;
      }
       //  1.3 如果res能获取到数据 用户信息拿到
       this.getToken(res)
    }

  }
</script>

<style lang="less" scoped>
  button {
    width: 600rpx;
    margin: 200rpx auto 0;
  }
</style>