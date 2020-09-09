<template>
  <div class="login-container">
    <div style="text-align: center; padding-top: 250px;" v-show="!isShown">
      <h1>{{str2}}</h1>
      <el-button round class="btn" @click="changeShown()">Click Here</el-button>
    </div>
    <el-card class="login-form" shadow="always" v-show="isShown">
      <div style="text-align: center">
        <i class="el-icon-cloudy" style="color: #409EFF; font-size:50px;"></i>
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <h2 class="login-title">云依网盘</h2>
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-iconuser" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-mima" placeholder="密码" show-password>
          </el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-input v-model="loginForm.code" prefix-icon="el-icon-key" placeholder='点击图片更换验证码' type="text"
            @keydown.enter.native="login()" style='width:200px;margin-right: 10px'></el-input>
          <img :src="vcUrl" alt="验证码" @click="updateVerifyCode()">
        </el-form-item>
        <el-form-item style="margin-bottom: 5px;text-align: center">
          <el-button style="width: 45%" type="primary" @click="login()">登录</el-button>
          <!-- <el-button style="width: 45%" type="primary" @click="dialogVisible = true">注册</el-button> -->
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      str: '欢迎您来到云依网盘',
      i: 0,
      timer: 0,
      str2: '',
      isShown: false,
      vcUrl: '',
      loginForm: {
        username: '',
        password: '',
        code: ''
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 13, message: '长度在 2 到 13 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.typing()
  },
  methods: {
    changeShown () {
      this.updateVerifyCode()
      this.isShown = !this.isShown
    },
    typing () {
      if (this.i < this.str.length) {
        this.str2 = this.str.slice(0, this.i++) + '_'
        this.timer = setTimeout(() => {
          this.typing()
        }, 200)
      } else {
        this.str2 = this.str.slice(0, this.i++)
        clearTimeout(this.timer)
      }
    },
    updateVerifyCode () {
      this.vcUrl = '/api/verifyCode?time=' + new Date()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // valid是一个布尔值，这是一个回调函数
        if (!valid) return 0
        // await只能用在被async修饰的方法中，只有当返回的数据是promise时才能使用
        const { data: res } = await this.$http.post('/api/login', this.loginForm)
        if (res.status !== 200) {
          return this.$message.error(res.msg)
        }
        this.$message.success('登陆成功')
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('home')
      })
    }
  }

}
</script>

<style lang="less" scoped>
h1 {
  color: black;
  text-align: center;
  font-size: 50px;
}
.login-container {
  background: url("../assets/image/background.jpg");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  height: 100%;
}
.btn {
  height: 80px;
  width: 250px;
  font-size: 30px;
}
.login-form {
  // background-color: aliceblue;
  position: absolute;
  left: 0;
  right: 0;
  width: 360px;
  margin: 140px auto;
  border-top: 10px solid #409eff;
}
.login-title {
  text-align: center;
  color: #409eff;
}
.el-form-item__content {
  display: flex;
  align-items: center;
  // 垂直居中
}
</style>
