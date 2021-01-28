<template>

  <body id="poster">
  <el-form class="login-container" label-position="left" :rules="rules" ref="LoginForm"
           label-width="0px" :model="loginForm">
    <h2 class="login_title">系统登录</h2>

    <el-form-item prop='username'>
      <el-input type="text" v-model="loginForm.username"
                auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop='password'>
      <el-input type="password" v-model="loginForm.password"
                auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="submitForm">登录
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-link type="primary" v-on:click="goRegister()" :underline="  false">还没账号？去 注册</el-link>
    </el-form-item>
  </el-form>
  </body>
</template>

<script>

export default {
  name: 'Login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 5, max: 20, message: '长度在5-20个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入用户密码', trigger: 'blur'},
          {min: 5, max: 20, message: '长度在5-20个字符', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs.LoginForm.validate((valid) => {
        if (valid) {
          this.login()
        } else {
          return false
        }
      })
    },

    login () {
      this.$axios
        .post('/user/login/', {
          username: this.loginForm.username,
          password: this.loginForm.password
        })
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.$notify({
              title: '登录成功',
              message: successResponse.data.errorMsg,
              type: 'info'
            })
            if (successResponse.data.data.roles[0] === 1) {
              this.$router.push('/sellerHome')
            } else if (successResponse.data.data.roles[0] === 2) {
              this.$router.push('/buyerHome')
            }
          }
        })
        .catch(failResponse => {
          alert(failResponse.toString())
        })
    },
    goRegister () {
      this.$router.push('/register')
    }
  }
}
</script>

<style>
#poster {
  background: url("../assets/login_backgroud.jpg") no-repeat center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
}

body {
  margin: 0px;
}

.login-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.login_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

</style>
