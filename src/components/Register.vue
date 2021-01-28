<template>

  <body id="poster">
  <el-form class="register-container" label-position="left" :rules="rules" ref="registerForm"
           label-width="0px" :model="registerForm">
    <div ref="alertMsg">
      <h5>{{ alterMsg }}</h5>
    </div>
    <h2 class="register_title">用户注册</h2>

    <el-form-item prop='username'>
      <el-input type="text" v-model="registerForm.username"
                auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop='password'>
      <el-input type="password" v-model="registerForm.password"
                auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item prop='passwordAgain'>
      <el-input type="password" v-model="registerForm.passwordAgain"
                auto-complete="off" placeholder="确认密码"></el-input>
    </el-form-item>
    <el-form-item prop="role">
      <el-select v-model="registerForm.role" placeholder="请选择用户角色" auto-complete="off">
        <el-option v-for="(item,index) in roles" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="width: 100%">
      <el-button type="primary" style="width: 100%;background: #505458;border: none" v-on:click="submitForm">注册
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-link type="primary" v-on:click="goLogin" :underline="  false">已有账号？去 登录</el-link>
    </el-form-item>
  </el-form>
  </body>
</template>

<script>

export default {
  name: 'Login',
  created () {
    this.getRoles()
  },
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }

    return {
      registerForm: {
        username: '',
        password: '',
        passwordAgain: '',
        role: ''
      },
      alterMsg: '', // 弹出框中的提示语

      rules: {
        username: [
          {required: true, message: '请输入用户名称', trigger: 'blur'},
          {min: 5, max: 20, message: '长度在5-20个字符', trigger: 'blur'}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'},
          {min: 5, max: 20, message: '长度在5-20个字符', trigger: 'blur'}
        ],
        passwordAgain: [
          {validator: validatePass2, trigger: 'blur'}
        ],
        role: [
          {required: true, message: '请选择用户角色', trigger: 'change'}
        ]
      },
      responseResult: [],
      roles: []
    }
  },
  methods: {
    getRoles () {
      this.$axios.get('/role/all')
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.roles = successResponse.data.data
          }
        })
        .catch(failureResponse => {
          console.log('fail')
        })
    },
    submitForm (formName) {
      this.$refs.registerForm.validate((valid) => {
        if (valid) {
          this.register()
        } else {
          return false
        }
      })
    },
    goLogin () {
      this.$router.push({path: '/login'})
    },

    register () {
      this.$axios
        .post('/user/register', {
          username: this.registerForm.username,
          password: this.registerForm.password,
          roleId: this.registerForm.role
        })
        .then(successResponse => {
          if (successResponse.data.errorCode === 200) {
            this.$notify({
              title: '成功',
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

.register-container {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 90px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  /*background: #fff;*/
  background-color: transparent;
  filter: Alpha(opacity=90);
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.register_title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}

</style>
