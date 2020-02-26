<template>
  <view :style="{height: pageHeight, overflow: 'hidden'}">
    <search @search="disableScroll" />
    <!-- 焦点图 -->
    <swiper class="banner" indicator-dots indicator-color="rgba(255, 255, 255, 0.6)" indicator-active-color="#fff">
      <swiper-item v-for="item in bannerList" :key="item.goods_id">
        <navigator :url="'/pages/goods/index?id=' + item.goods_id">
          <image :src="item.image_src"></image>
        </navigator>
      </swiper-item>
    </swiper>



    <!-- 导航条 -->
    <view class="navs">
      <navigator v-for="item in navList" :key="item.name" open-type="switchTab" url="/pages/category/index">
        <image :src="item.image_src"></image>
      </navigator>
    </view>




    <!-- 楼层 -->
    <view class="floors">
      <view class="floor" v-for="item in floorList" :key="item.floor_title.name">
        <view class="title">
          <image :src="item.floor_title.image_src"></image>
        </view>
        <view class="items">
          <navigator v-for="(product,index) in item.product_list" :key="index"  url="/pages/list/index">
            <image :src="product.image_src"></image>
          </navigator>
        </view>
      </view>
    </view>
    <!-- 回到顶部 -->



    <view class="goTop icon-top" v-if="show" @click="goTop"></view>
  </view>




</template>

<script>
  import search from '@/components/search';

  export default {

    data () {
      return {
        pageHeight: 'auto',

        bannerList:[],

        navList:[],

        floorList:[],

        show:false  //控制返回顶部按钮显示隐藏
      }
    },

    components: {
      search
    },
    
    methods: {

       //返回顶部
      goTop(){
        //原生API
          uni.pageScrollTo({
              scrollTop:0
          })
      },
      disableScroll (ev) {
        this.pageHeight = ev.pageHeight + 'px';
      },

      async getNavList(){

        //请求后端接口
        const {message} = await this.request({
          url: '/api/public/v1/home/swiperdata'
        })

        //更新初始化数据
        // console.log(res); 
        this.bannerList = message; //返回数据
      },

      async getBannerList(){

        //请求后端接口
        const {message} = await this.request({
          url: '/api/public/v1/home/catitems'
        })

        //更新初始化数据
        // console.log(res); 
        this.navList = message; //返回数据
      },


      async getFloorList(){

        //请求后端接口
        const {message} = await this.request({
          url: '/api/public/v1/home/floordata'
        })
        //更新初始化数据
        // console.log(res); 
        this.floorList = message; //返回数据
      },
    },

    onLoad(){
      //发请求 获取数据
    this.getBannerList()

    this.getNavList()

    this.getFloorList()

    },

     // 当用户转发的时候
    onShareAppMessage () {
      return {
          title: '欢迎使用UGO!',
          imageUrl: 'http://www.999zx.cn/adm_file/fck/images/2018/4/Image/20184386447866.jpg',
          path: '/pages/index/index'
      }
    },

    // 响应页面下拉刷新   uniapp原生API
    async  onPullDownRefresh(){
       //发请求 获取数据
      await  this.getBannerList()

      await this.getNavList()

      await this.getFloorList()

      // 请求完成时，下拉还在！！！等待所有请求完成的时候(加上async await)，关闭下拉效果！
      // api：结束下拉效果  文档 / API
      uni.stopPullDownRefresh();
    },

    //页面滚动控制按钮显示隐藏

    onPageScroll(e){
      if (e.scrollTop>200) {
        this.show = true
      }else{
        this.show = false
      }
    }
  
  }
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    height: 340rpx;

    image {
      width: 100%;
      height: 340rpx;
    }
  }

  .navs {
    display: flex;
    justify-content: space-between;
    padding: 30rpx 44rpx;

    image {
      width: 128rpx;
      height: 140rpx;
    }
  }

  .floor {

    .title {
      width: 750rpx;
      height: 60rpx;
      padding: 20rpx 0 0 8rpx;
      background-color: #f4f4f4;
    }

    .items {
      padding: 20rpx 16rpx;
      overflow: hidden;

      navigator {
        width: 193rpx;
        height: 188rpx;
        margin-left: 10rpx;
        margin-bottom: 10rpx;
        float: left;
      }

      navigator:first-child {
        width: 232rpx;
        height: 386rpx;
        margin-left: 0rpx;
      }

      navigator:nth-child(2),
      navigator:nth-child(5) {
        width: 273rpx;
      }
    }

    &:first-child {

      .items {

        navigator {
          width: 233rpx;
        }
      }
    }
  }

  .goTop {
    position: fixed;
    bottom: 30rpx;
    /* #ifdef H5 */
    bottom: 65px;
    /* #endif */
    right: 30rpx;
  
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100rpx;
    height: 100rpx;
    font-size: 48rpx;
    color: #666;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>