<template>

  <body>
  <el-container style="border: 0px solid #eee">

    <el-header style="font-size: 15px" >
      <el-row>
        <el-col :span="12">
          <div class="grid-content bg-purple" align="left">
            <el-button type="primary">首页</el-button>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="grid-content bg-purple-light" align="right">
            <span class="username" style="font-size: 30px">你好！<strong>{{ username }}(当前余额：{{ money }}元)</strong></span>
            <el-select v-model="role" placeholder="请选择用户角色" auto-complete="off" aria-label="just"
                       @change="changeRole()">
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
                <span>已出售：{{ sub.sellNumbers }}件</span>
                <p></p>
                <span>价格：{{ sub.price }}元</span>
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
            >
            <el-form status-icon label-width="100px" class="demo-ruleForm" :model="goodsInfo">
              <el-image
                style="width: 400px; height: 450px; cursor: pointer"
                :src='this.goodsInfo.image'>
              </el-image>

              <span>
                <el-upload
                  class="upload-demo"
                  drag
                  action=""
                  :before-upload="updateImage"
                  multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg,png,gif,jpeg文件，且不超过1M</div>
              </el-upload>
                <el-form-item label="名称">
                  <el-input type="text" v-model="goodsInfo.title" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="价格">
                  <el-input type="text" v-model="goodsInfo.price" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="摘要">
                 <el-input type="text" v-model="goodsInfo.remark" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                  <el-input type="text" v-model="goodsInfo.content" autocomplete="off"></el-input>
                </el-form-item>
              </span>
              <el-form-item>
                <el-button type="primary" @click="updateGoods()">修改信息
                </el-button>
              </el-form-item>
            </el-form>

          </el-drawer>
        </el-tab-pane>
        <el-tab-pane label="发布商品" name="second" class="add-goods-container">
          <el-form :model="newGoodsInfo" :rules="newGoodsInfoRules" ref="newGoodsInfo" label-width="100px"
                   class="demo-ruleForm">
            <el-form-item label="商品名称" prop="title">
              <el-input v-model="newGoodsInfo.title"></el-input>
            </el-form-item>
            <el-form-item label="摘要" prop="remark">
              <el-input v-model="newGoodsInfo.remark"></el-input>
            </el-form-item>
            <el-form-item label="主要内容" prop="content">
              <el-input v-model="newGoodsInfo.content"></el-input>
            </el-form-item>
            <el-form-item label="价格（元）" prop="price">
              <el-input v-model="newGoodsInfo.price"></el-input>
            </el-form-item>
            <el-form-item label="商品图片" prop="image">
              <input
                v-on:change="newGoodsInfo.image"
                type="file" accept="image/gif,image/jpeg,image/jpg,image/png" ref="avatarInput">
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitGoodsForm()">立即创建</el-button>
              <el-button @click="resetGoodsForm()">重置</el-button>
            </el-form-item>
          </el-form>
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
    var id
    this.$axios.get('/user/info')
      .then(successResponse => {
        if (successResponse.data.errorCode === 200) {
          this.roles = successResponse.data.data.role
          this.username = successResponse.data.data.username
          this.money = successResponse.data.data.money
          this.id = successResponse.data.data.id
          id = successResponse.data.data.id
        }
      })
    this.$axios.get('goods/list', {
      params: {
        size: this.size, page: this.curPage, order: this.order, orderBy: this.orderBy, sellerId: id
      }
    })
      .then(successResponse => {
        if (successResponse.data.errorCode === 200) {
          this.data = successResponse.data.data.data
          this.curPage = successResponse.data.data.page
          this.totalPages = successResponse.data.data.totalPages
          this.totalNumbers = successResponse.data.data.totalNumbers
          this.$notify({
            title: 'data获取成功',
            message: successResponse.data.errorMsg,
            type: 'info'
          })
        }
        return true
      })
  },
  data () {
    var isPrice = (rule, value, callback) => {
      if (!value) {
        callback()
      } else {
        var reg = /^-?\d{1,4}(?:\.\d{1,2})?$/
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('数字格式:0-9999或小数点后可加1到2位'))
        }
      }
    }
    return {
      newGoodsInfo: {
        title: '',
        remark: '',
        content: '',
        price: '',
        image: ''
      },
      rechargeMoney: 0,
      newGoodsInfoRules: {
        title: [
          {required: true, message: '请输入商品名称', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '请输入商品价格', trigger: 'blur'},
          {validator: isPrice, trigger: 'blur'}
        ],
        image: [
          {required: true, message: '请输入商品价格', trigger: 'blur'}
        ]
      },
      goodsInfo: {
        title: '',
        remark: '',
        content: '',
        price: '',
        id: '',
        number: 1
      },
      drawer: false,
      direction: 'rtl',
      data: [],
      activeName: 'first',
      username: 'netease',
      roles: [],
      role: 1,
      allRoles: [],
      id: 0,
      money: 0,
      size: 10,
      order: 'desc',
      orderBy: 'createTime',
      sellerId: '',
      buyerId: '',
      curPage: 1,
      totalPages: 0,
      totalNumbers: 0
    }
  },
  methods: {
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
    changeRole () {
      if (this.role === 1) {
        this.$router.push('/sellerHome')
      } else if (this.role === 2) {
        this.$router.push('/buyerHome')
      }
    },
    submitGoodsForm () {
      var formData = new FormData()
      var file = this.$refs.avatarInput.files[0]
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
        return
      }
      formData.append('image', file)
      formData.append('title', this.newGoodsInfo.title)
      formData.append('price', this.newGoodsInfo.price)
      formData.append('content', this.newGoodsInfo.content)
      formData.append('remark', this.newGoodsInfo.remark)
      this.$instance.post('/api/goods/add/', formData)
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.$notify({
              title: '成功',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
            this.resetGoodsForm()
          } else {
            this.$notify({
              title: '失败',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
          }
          this.getData()
        })
    },
    resetGoodsForm () {
      this.newGoodsInfo.image = ''
      this.newGoodsInfo.price = ''
      this.newGoodsInfo.title = ''
      this.newGoodsInfo.content = ''
      this.newGoodsInfo.remark = ''
    },
    updateImage (file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (!isLt1M) {
        this.$message.error('上传头像图片大小不能超过 1MB!')
        return false
      }
      var formData = new FormData()
      formData.append('image', file)
      formData.append('goodsId', this.goodsInfo.id)
      this.$instance.post('/api/goods/updateImage/', formData)
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
      this.getData()
      return false
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
      this.goodsInfo.number = 1
    },
    updateGoods () {
      var sub = this.goodsInfo
      this.$axios.post('/goods/update/', {
        id: sub.id, price: sub.price, title: sub.title, remark: sub.remark, content: sub.content
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
          size: this.size, page: this.curPage, order: this.order, orderBy: this.orderBy, sellerId: this.id
        }
      })
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.data = successResponse.data.data.data
            this.curPage = successResponse.data.data.page
            this.totalPages = successResponse.data.data.totalPages
            this.totalNumbers = successResponse.data.data.totalNumbers
            this.$notify({
              title: 'data获取成功',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
          }
          return true
        })
    },
    handleClick (tab, event) {
      console.log(tab, event)
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
