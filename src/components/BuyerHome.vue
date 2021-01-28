<template>

  <body>
  <el-container style="border: 0px solid #eee">

    <el-header style="font-size: 15px">
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple" align="left">
            <el-button type="primary">首页</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light" align="right">
            <span class="username" style="font-size: 30px">你好！<strong>{{ username }}(当前余额：{{ money }}元)</strong></span>
            <el-select v-model="role" placeholder="请选择用户角色" auto-complete="off" aria-label="just" @change="changeRole">
              <el-option v-for="(item,index) in roles" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-dropdown style="text-align: left" :hide-on-click="false">
              <i class="el-icon-setting el-icon-arrow-down el-icon--right"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
                <el-dropdown-item @click.native="addRole(1)">添加seller角色</el-dropdown-item>
                <el-dropdown-item @click.native="addRole(2)">添加buyer角色</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-col>
      </el-row>

    </el-header>
    <el-main>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="所有内容" name="first">
          <el-row :gutter="20" style="position: initial">
            <el-col :span="4" v-for="sub in data" :key="sub.id" class="goods-container">
              <div class="grid-content bg-purple">
                <span><strong>{{ sub.title }}</strong></span>
                <p></p>
                <span>已出售：{{ sub.sellNumbers }}件;已购买：{{ sub.buyNumbers }}件</span>
                <p></p>
                <span>价格：{{ sub.price }}元； 卖家：{{ sub.owner.username }}</span>
                <p></p>
                <el-image @click="loadGoodsInfo(sub)"
                          style="width: 200px; height: 250px; cursor: pointer"
                          :src='sub.image'
                >
                </el-image>
              </div>
            </el-col>
          </el-row>
          <el-pagination @current-change="handlerPageChange"
                         :page-size="size"
                         :current-page="curPage"
                         :pager-count="5"
                         layout="prev, pager, next"
                         :total="totalNumbers">
          </el-pagination>
          <el-drawer
            title="商品详情"
            :visible.sync="drawer"
            :direction="direction"
            :before-close="handleClose">
            <el-form status-icon label-width="100px" class="demo-ruleForm" :model="goodsInfo">
              <el-image
                style="width: 400px; height: 450px; cursor: pointer"
                :src='this.goodsInfo.image'>
              </el-image>

              <span>
                <el-form-item label="名称">
                  <el-input type="text" v-model="goodsInfo.title" autocomplete="off" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                  <el-input type="text" v-model="goodsInfo.price" autocomplete="off" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="摘要">
                 <el-input type="text" v-model="goodsInfo.remark" autocomplete="off" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                  <el-input type="text" v-model="goodsInfo.content" autocomplete="off" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="购买数量">
                   <el-input-number v-model="goodsInfo.number" :min="1" :max="10" label="描述文字"></el-input-number>
                </el-form-item>
              </span>

              <el-form-item>
                <el-button type="primary" @click="addCart(goodsInfo)">加入购入车</el-button>
                <el-button type="primary" @click="buy(goodsInfo)">直接给购买</el-button>
              </el-form-item>
            </el-form>

          </el-drawer>
        </el-tab-pane>
        <el-tab-pane label="购物车" name="second">
          <el-table
            height="700"
            stripe
            ref="multipleTable"
            :data="cartData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="50">
            </el-table-column>
            <el-table-column
              label="图片"
              width="200">
              <template slot-scope="scope">
                <el-image
                  style="width: 100px; height: 100px; cursor: pointer"
                  :src='scope.row.goods.image'>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
              label="加购日期"
              width="200">
              <template slot-scope="scope">{{ renderTime(scope.row.createTime) }}</template>
            </el-table-column>
            <el-table-column
              prop="goods.title"
              label="名称"
              width="200">
            </el-table-column>
            <el-table-column
              prop="number"
              label="数量"
              width="200"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="cartBuy([scope.row.id])">购买
                </el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="cartDelete([scope.row.id])">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="margin-top: 20px">
            <el-button @click="cartBuy(multipleSelection)">批量购买</el-button>
            <el-button @click="cartDelete(multipleSelection)" type="danger">批量删除</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="订单" name="fourth">
          <el-table
            height="700"
            stripe
            ref="multipleOrderTable"
            :data="orderData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column
              label="图片"
              width="200">
              <template slot-scope="scope">
                <el-image
                  style="width: 100px; height: 100px; cursor: pointer"
                  :src='scope.row.imagePath'>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
              label="购买日期"
              width="200">
              <template slot-scope="scope">{{ renderTime(scope.row.createTime) }}</template>
            </el-table-column>
            <el-table-column
              prop="title"
              label="名称"
              width="200">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="商品摘要"
              width="200">
            </el-table-column>
            <el-table-column
              prop="number"
              label="购买数量"
              width="200"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="unitPrice"
              label="购买时价格（元）"
              width="200"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="unitPrice"
              label="现在价格（元）"
              width="200"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column
              prop="seller.username"
              label="卖家"
              width="200"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="buyInOrder(scope.row)"
                >再次购买
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-drawer
            title="商品详情"
            :visible.sync="OrderDrawer"
            :direction="direction"
            :before-close="handleClose">
            <el-form status-icon label-width="100px" class="demo-ruleForm" :model="goodsInfo">
              <el-image
                style="width: 400px; height: 450px; cursor: pointer"
                :src='this.goodsInfo.image'>
              </el-image>

              <span>
                <el-form-item label="名称">
                  <el-input type="text" v-model="goodsInfo.title" autocomplete="off" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                  <el-input type="text" v-model="goodsInfo.price" autocomplete="off" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="摘要">
                 <el-input type="text" v-model="goodsInfo.remark" autocomplete="off" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                  <el-input type="text" v-model="goodsInfo.content" autocomplete="off" readonly="readonly"></el-input>
                </el-form-item>
                <el-form-item label="购买数量">
                   <el-input-number v-model="goodsInfo.number" :min="1" :max="10" label="描述文字"></el-input-number>
                </el-form-item>
              </span>

              <el-form-item>
                <el-button type="primary" @click="addCart(goodsInfo)">加入购入车</el-button>
                <el-button type="primary" @click="buy(goodsInfo)">直接给购买</el-button>
              </el-form-item>
            </el-form>

          </el-drawer>
          <el-pagination @current-change="handlerOrderPageChange"
                         :page-size="orderSize"
                         :current-page="curOrderPage"
                         :pager-count="5"
                         layout="prev, pager, next"
                         :total="totalOrderNumbers">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="余额充值" name="third" class="add-goods-container">
          <el-form>
            <el-form-item label="充值金额（元）" prop="price">
              <el-input v-model="rechargeMoney"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="recharge()">充值</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-main>

  </el-container>
  </body>
</template>

<style>

.username {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

.goods-container {
  /*position: center;*/
  border-radius: 15px;
  background-clip: padding-box;
  background-color: transparent;
  margin: 10px auto;
  width: 20%;
  height: 10%;
  padding: 0px 0px 0px 0px;
  filter: Alpha(opacity=90);
  border: 5px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.add-goods-container {
  border-radius: 15px;
  background-clip: padding-box;
  background-color: transparent;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  /*background: #fff;*/
  filter: Alpha(opacity=90);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}
</style>

<script>
import App from '../App'

export default {
  name: 'Home',
  components: {App},
  created () {
    this.getUserInfo()
    this.getData()
  },
  data () {
    return {
      orderData: [],
      rechargeMoney: 0,
      goodsInfo: {
        title: '',
        remark: '',
        content: '',
        price: '',
        id: '',
        number: 1
      },
      drawer: false,
      OrderDrawer: false,
      direction: 'rtl',
      data: [],
      activeName: 'first',
      username: 'netease',
      roles: [],
      role: 2,
      allRoles: [],
      id: 0,
      money: 0,
      size: 10,
      order: 'desc',
      orderBy: 'createTime',
      sellerId: '',
      buyerId: '',
      curPage: 1,
      orderPage: 1,
      totalPages: 0,
      totalNumbers: 0,
      cartData: [],
      multipleSelection: [],
      curOrderPage: 1,
      totalOrderPage: 0,
      totalOrderNumbers: 0,
      orderSize: 5
    }
  },
  methods: {
    buyInOrder (row) {
      this.goodsInfo.price = row.currentPrice
      this.goodsInfo.number = 1
      this.goodsInfo.id = row.goodsId
      this.goodsInfo.content = row.content
      this.goodsInfo.remark = row.remark
      this.goodsInfo.image = row.imagePath
      this.goodsInfo.title = row.title
      this.OrderDrawer = true
    },
    renderTime (date) {
      var dateee = new Date(date).toJSON()
      return new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    getShoppingCart () {
      this.$axios.get('/cart/list/', {})
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.$notify({
              title: '成功',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
            this.cartData = successResponse.data.data
          }
        })
    },
    recharge () {
      this.$axios.post('/user/recharge/', {money: this.rechargeMoney})
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.$notify({
              title: '成功',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
            this.rechargeMoney = 0
            this.getUserInfo()
          }
        })
    },
    addCart (sub) {
      this.$axios.post('/cart/add/', {
        goodsId: sub.id, number: sub.number
      })
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.$notify({
              title: '成功',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
          }
        })
      this.drawer = false
      this.OrderDrawer = false
      this.goodsInfo.number = 1
    },
    handleSelectionChange (val) {
      var ids = []
      for (var v = 0; v < val.length; v++) {
        ids.push(val[v].id)
      }
      this.multipleSelection = ids
    },
    buy (sub) {
      this.$axios.post('/transaction/add/', {
        goodsId: sub.id, number: sub.number
      })
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.$notify({
              title: '成功',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
          }
        })
      this.drawer = false
      this.OrderDrawer = false
      this.goodsInfo.number = 1
      this.getUserInfo()
    },
    loadGoodsInfo (sub) {
      this.goodsInfo = sub
      this.drawer = true
    },
    handleClose (done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {
        })
    },
    handlerPageChange (val) {
      this.curPage = val
      this.getData()
    },
    handlerOrderPageChange (val) {
      this.curOrderPage = val
      this.getOrderData()
    },
    addRole (roleId) {
      this.$axios.post('/user/addRole', {roleId: roleId})
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.$notify({
              title: '成功',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
          }
        })
        .catch(failureResponse => {
          console.log('fail')
        })
    },
    getData () {
      this.$axios.get('goods/list', {
        params: {
          size: this.size, page: this.curPage, order: this.order, orderBy: this.orderBy
        }
      })
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.data = successResponse.data.data.data
            this.curOrderPage = successResponse.data.data.page
            this.totalPages = successResponse.data.data.totalPages
            this.totalNumbers = successResponse.data.data.totalNumbers
            this.$notify({
              title: 'data获取成功',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
          }
        })
    },
    handleClick (tab, event) {
      if (tab.index === '0') {
        this.getData()
      } else if (tab.index === '1') {
        this.getShoppingCart()
      } else if (tab.index === '2') {
        this.getOrderData()
      }
    },
    getOrderData () {
      this.$axios.get('/transaction/list/', {
        params: {
          size: this.orderSize, page: this.curOrderPage, order: this.order, orderBy: this.orderBy, buyerId: this.id
        }
      })
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.orderData = successResponse.data.data.data
            this.curOrderPage = successResponse.data.data.page
            this.totalOrderPage = successResponse.data.data.totalPages
            this.totalOrderNumbers = successResponse.data.data.totalNumbers
            this.$notify({
              title: '成功',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
          }
        })
    },
    cartDelete (ids) {
      var formData = new FormData()
      for (var i = 0; i < ids.length; i++) {
        formData.append('ids', ids[i])
      }
      this.$instance.post('/api/cart/delete/', formData)
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.$notify({
              title: '成功删除',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
          }
          this.getShoppingCart()
          this.multipleSelection = []
        })
    },
    cartBuy (ids) {
      var formData = new FormData()
      for (var i = 0; i < ids.length; i++) {
        formData.append('ids', ids[i])
      }
      this.$instance.post('/api/cart/buy/', formData)
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.$notify({
              title: '成功购买',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
          }
          this.getShoppingCart()
          this.multipleSelection = []
        })
    },
    getUserInfo () {
      this.$axios.get('/user/info')
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.roles = successResponse.data.data.role
            this.username = successResponse.data.data.username
            this.money = successResponse.data.data.money
            this.id = successResponse.data.data.id
          }
        })
    },
    changeRole () {
      if (this.role === 1) {
        this.$router.push('/sellerHome')
      } else if (this.role === 2) {
        this.$router.push('/buyerHome')
      }
    },
    logout () {
      this.$axios.post('/user/logout/', {})
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.$notify({
              title: '成功退出',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
            this.$router.push('/login')
          }
        })
    }
  }
}

</script>
