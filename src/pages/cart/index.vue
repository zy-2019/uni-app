<template>
  <view class="wrapper">
    <!-- 收货信息 -->
    <view class="shipment">
      <block v-if="addr">
          <view class="dt">收货人: </view>
        <view class="dd meta">
          <text class="name">{{addr.userName}}</text>
          <text class="phone">{{addr.telNumber}}</text>
        </view>
        <view class="dt">收货地址:</view>
        <view class="dd">{{addr.details}}</view>
      </block>

      <button @click="getAttr" v-else type="primary">收货地址</button>
      
    </view>
    <!-- 购物车 -->
    <view class="carts">
      <view class="item">
        <!-- 店铺名称 -->
        <view class="shopname">优购生活馆</view>
        <view class="goods" v-for="(item,index) in carts" :key="item.goods_id">
          <!-- 商品图片 -->
          <image class="pic" :src="item.goods_small_logo"></image>
          <!-- 商品信息 -->
          <view class="meta">
            <view class="name">{{item.goods_name}}</view>
            <view class="price">
              <text>￥</text>{{item.goods_price}}<text>.00</text>
            </view>
            <!-- 加减 -->
            <view class="amount">
              <text class="reduce" @click="changeNum(-1,index)">-</text>
              <input type="number" :value="item.goods_number" class="number">
              <text class="plus" @click="changeNum(1,index)">+</text>
            </view>
          </view>
          <!-- 选框 -->
          <view class="checkbox">
            <icon @click="radio(index)" type="success" size="20" :color="item.goods_buy ? '#ea4451' : '#ccc'"></icon>
          </view>
        </view>
      </view>
    </view>
    <!-- 其它 -->
    <view class="extra">
      <label class="checkall">
        <icon @click="selectAll" type="success" :color="is ? '#ea4451' : '#ccc'" size="20"></icon>
        全选
      </label>
      <view class="total">
        合计: <text>￥</text><label>{{sum}}</label><text>.00</text>
      </view>
      <view class="pay" @click="totalMoney">结算({{buy_carts.length}})</view>
    </view>
  </view>
</template>

<script>
  export default {
    data(){
      return{
        carts:[],
        addr:null,
      }
    },

    computed:{

      // 把选中的商品 筛选出来
      buy_carts(){
    
        var arr = [];

        this.carts.forEach(function (item,index) { 
            // 商品要buy 状态
            if (item.goods_buy) {
                arr.push(item);
            }
        });

        return arr;
      },

       //反选  全选
      is(){
        return this.buy_carts.length == this.carts.length
       },
      
      //选中的商品
      sum(){

        var all = 0;

        this.buy_carts.forEach(function (item) {
          
          all += item.goods_number * item.goods_price

        });

        return all;
      }
    },

    methods:{

      //商品结算时要判断
    async totalMoney(){
        // 1.判断有没有地址
        if (!this.addr) {
            uni.showToast({title:"无收货地址",icon:"none"});
            return;
        }
        // 2.必须有选择的商品
        if (!this.buy_carts.length) {
             uni.showToast({title:"无选择商品",icon:"none"});
            return;
        }
        // 3.当前用户是否登录 token
        if (!uni.setStorageSync("token")) {
            // 没有登录让用户登录  跳转登录页面
          uni.navigateTo({
            url:'/pages/auth/index'
          })
          return;
        }

        const {message,meta} = await this.request({
          
          url:"/api/public/v1/my/orders/create",
          method:"POST",
          header:{"Authorization" : uni.getStorageSync("token")},
          data:{
              order_price:this.sum,
              consignee_addr:this.addr.details,
              goods:this.ck_carts
          }
        })

        if (meta.status == 200) {

          // 清除购物车数据的数据 （业务上）
          // 清空掉
          uni.removeStorageSync("carts");

           // 转跳页面
          uni.navigateTo({
              url:"/pages/order/index"
          });
        }

      },

      //获取地址

      getAttr(){
        uni.chooseAddress({
            success:(res)=>{
              
            this.addr = res;
            // 详细地址
            this.addr.details = res.provinceName+res.cityName+res.countyName+res.detailInfo;
          }
        });

      },
      //全选按钮
      selectAll(){
          // 1.拿到当前全选的状态  is
        var zt = !this.is;

        this.carts.forEach(function(item){
          
          item.goods_buy = zt;

        })

        uni.setStorageSync("carts", this.carts)

      },

      //单选框  
      radio(index){

        this.carts[index].goods_buy = !this.carts[index].goods_buy

        //存回到本地

        uni.setStorageSync("carts",this.carts)
      },

      //这里是把上面的标识加上小标传出来
      changeNum(key,index){
        
        // ------------------------2.页面数据改变
        // key
        // -1 ：点击是-
        // 1 ：点击是+

        // - :至少有一件商品
        if (key==-1 && this.carts[index].goods_number == 1) {
          return;
        }

        // +: 按照道理和库存量对比
        if (key==1&&this.carts[index].goods_number>=15) {
          return;
        }

        // +
        // if (key==1) {
        //   this.carts[index].goods_number += 1;
        // }

        // - 
        // if (key==-1) {
        //   this.carts[index].goods_number += -1;
        // }
        // 讨巧的抒写方式

        this.carts[index].goods_number += key;


        //存回到本地

        uni.setStorageSync("carts",this.carts)


      }
    },

    onLoad(){
      
    },


    onShow(){
      //读取数据完成
      this.carts = uni.getStorageSync("carts") || []
    }
  }
</script>

<style scoped lang="less">
  .shipment {
    height: 100rpx;
    line-height: 2;
    padding: 30rpx 30rpx 40rpx 30rpx;
    font-size: 27rpx;
    color: #333;
    background-color: #fff;
    background-image: url(http://static.botue.com/ugo/images/cart_border%402x.png);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom;

    .dt {
      width: 140rpx;
      float: left;
      clear: both;
    }

    .dd {
      padding-left: 160rpx;
    }

    .meta {
      padding-right: 50rpx;
    }

    text.phone {
      float: right;
    }
  }

  .carts {
    background-color: #f4f4f4;
    padding-bottom: 110rpx;
    overflow: hidden;

    .shopname {
      padding: 30rpx;
      margin-top: 20rpx;
      font-size: 30rpx;
      color: #333;
      background-color: #fff;
      border-top: 1rpx solid #eee;
      border-bottom: 1rpx solid #eee;
    }

    .goods {
      display: flex;
      padding: 30rpx 20rpx 30rpx 0;
      margin-left: 100rpx;
      border-bottom: 1rpx solid #eee;
      background-color: #fff;
  
      position: relative;

      .checkbox {
        width: 101rpx;
        height: 100%;
        background-color: #fff;

        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: -100rpx;
        top: 0;
      }

      &:last-child {
        border-bottom: none;
      }

      .pic {
        width: 200rpx;
        height: 200rpx;
        margin-right: 30rpx;
      }

      .meta {
        flex: 1;
        font-size: 27rpx;
        color: #333;
        position: relative;
      }

      .name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .price {
        position: absolute;
        bottom: 0;

        color: #ea4451;
        font-size: 33rpx;

        text {
          font-size: 22rpx;
        }
      }

      .amount {
        position: absolute;
        bottom: 0;
        right: 20rpx;

        height: 48rpx;
        text-align: center;
        border: 1rpx solid #ddd;
        border-radius: 8rpx;

        display: flex;
        align-items: center;

        text {
          display: block;
          width: 60rpx;
          line-height: 48rpx;
          font-size: 36rpx;
          color: #ddd;
          text-align: center;
        }

        input {
          width: 60rpx;
          height: 48rpx;
          min-height: 48rpx;
          font-size: 27rpx;
          border-left: 1rpx solid #ddd;
          border-right: 1rpx solid #ddd;
        }
      }
    }
  }

  .extra {
    position: fixed;
    bottom: 0;
    /* #ifdef H5 */
    bottom: 50px;
    /* #endif */
    left: 0;
    z-index: 9;

    width: 750rpx;
    height: 96rpx;
    text-align: center;
    line-height: 96rpx;
    font-size: 36rpx;
    border-top: 1rpx solid #eee;
    background-color: #fff;
    color: #333;
    display: flex;

    .checkall {
      width: 140rpx;
      line-height: 1;
      margin-left: 25rpx;
      display: flex;
      align-items: center;

      icon {
        margin-right: 20rpx;
      }
    }

    .total {
      display: flex;
      justify-content: center;
      flex: 1;

      label, text {
        color: #ea4451;
        vertical-align: bottom;
        position: relative;
        bottom: -2rpx;
      }

      text {
        position: relative;
        bottom: -3rpx;
        font-size: 24rpx;

        &:first-child {
          margin-left: 10rpx;
        }
      }
    }

    .pay {
      width: 200rpx;
      background-color: #ea4451;
      color: #fff;
    }
  }
</style>

