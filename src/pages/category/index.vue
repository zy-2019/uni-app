<template>
  <view>
    <!-- 搜索 -->
    <search />
    <!-- 分类 -->
    <view class="category">
      <!-- 顶级分类 -->
      <view class="sup">
        <scroll-view scroll-y>
          <text 
          :class="{'active':(index == ac_index ? true : false)}" 
          v-for="(item,index) in oneCategory" 
          :key="item.cat_id"
          @click="change(index)"
          >
          {{item.cat_name}}
          </text>
        </scroll-view>
      </view>
      <!-- 子级分类 -->
      <view class="sub">
        <scroll-view scroll-y>
          <!-- 封面图 -->
          <image src="http://static.botue.com/ugo/uploads/category.png" class="thumb"></image>

          <view class="children" v-for="erji in oneCategory[ac_index].children" :key="erji.cat_id">
            <view class="title">{{erji.cat_name}}</view>
            <!-- 品牌 -->
            <view class="brands">
              <navigator url="/pages/list/index" v-for="sanji in erji.children" :key="sanji.cat_id">
                <image :src="sanji.cat_icon"></image>
                <text>{{sanji.cat_name}}</text>
              </navigator>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
  import search from '@/components/search';

  export default {

    data(){
      return {
        oneCategory:[],
        ac_index:0 //存放一级导航下标  默认是零
      }
      
    },
    components: {
      search
    },

    methods:{

      //点击一级切换二级页面
      change(index){
        this.ac_index = index
      },

    async getData(){

        //获取分类数据
        //请求后端接口
        const {message} = await this.request({
          url: '/api/public/v1/categories'
        })
        //更新初始化数据
        // console.log(message); 
        this.oneCategory = message; //返回数据
      }
    },

    onLoad(){

      this.getData()
    
    }
  }
</script>

<style scoped lang="less">
  scroll-view {
    height: 100%;
  }

  .category {
    display: flex;
    width: 100%;
    position: absolute;
    top: 100rpx;
    bottom: 0;

    .sup {
      width: 196rpx;
      background-color: #f4f4f4;

      text {
        display: block;
        height: 100rpx;
        text-align: center;
        line-height: 100rpx;
        font-size: 27rpx;
        color: #333;
        border-bottom: 1rpx solid #eee;

        &:last-child {
          border-bottom: none;
        }
        
        &.active {
          background-color: #FFF;
          color: #ea4451;
          position: relative;

          &::before {
            content: '';
            display: block;
            width: 8rpx;
            height: 60rpx;
            transform: translateY(-50%);
            background-color: #ea4451;

            position: absolute;
            left: 0;
            top: 50%;
          }
        }
      }
    }

    .sub {
      flex: 1;
      padding: 20rpx 18rpx;

      .thumb {
        width: 100%;
        height: 180rpx;
      }

      .children {
        text-align: center;
        color: #333;

        .title {
          display: inline-block;
          margin: 40rpx 0 20rpx;
          font-size: 30rpx;

          &::before {
            content: '/';
            margin-right: 20rpx;
            color: #666;
          }

          &::after {
            content: '/';
            margin-left: 20rpx;
            color: #666;
          }
        }
      }

      .brands {
        display: flex;
        flex-wrap: wrap;

        navigator {
          width: 33%;
          margin-bottom: 20rpx;
        }

        image {
          width: 120rpx;
          height: 120rpx;
        }

        text {
          display: block;
          font-size: 24rpx;
        }
      }
    }
  }
</style>
