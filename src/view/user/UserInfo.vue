<template>
  <div>
    <el-card class="box-card">
      <div slot="header">
        {{ userinfo.username }}
      </div>
      <div class="card-body">
        <div>邮箱：
          <el-tag>{{userinfo.email}}</el-tag>
        </div>
        <div>手机号：
          <el-tag>{{userinfo.mobile}}</el-tag>
        </div>
        <div style="display: flex;justify-content: space-around;margin-top: 10px">
          <el-button type="primary" @click="showEditDialog()">修改信息</el-button>
          <el-button type="danger" @click="showEditPassword()">修改密码</el-button>
        </div>
      </div>
    </el-card>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose()">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改密码 -->
    <el-dialog :visible.sync="editPasswordVisible" width="50%" @close="editPasswordClose">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormRef">
        <el-form-item prop="old">
          <el-input placeholder="请输入旧密码" type="password" v-model="ruleForm.old" show-password></el-input>
        </el-form-item>
        <el-form-item prop="new">
          <el-input placeholder="请输入新密码" type="password" v-model="ruleForm.new" show-password></el-input>
        </el-form-item>
        <el-form-item prop="checkpassword">
          <el-input placeholder="新确认密码" type="password" v-model="ruleForm.checkpassword" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPasswordVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPassword()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }

    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    var validatePass = (rule, value, callback) => {
      if (value === this.ruleForm.new) {
        return callback()
      }
      callback(new Error('两次输入密码不一致!'))
    }
    return {
      userinfo: {
        id: '',
        username: '',
        mobile: '',
        email: ''
      },
      editForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      ruleForm: {
        old: '',
        new: '',
        checkpassword: ''
      },
      editPasswordVisible: false,
      rules: {
        old: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        new: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        checkpassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.initUserInfo()
  },
  methods: {
    async initUserInfo () {
      const { data: res } = await this.$http.get('/api/users/info')
      if (res.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.userinfo = res.data
    },
    showEditDialog () {
      this.editForm = this.userinfo
      this.editDialogVisible = true
    },
    async showEditPassword () {
      this.editPasswordVisible = true
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    editPasswordClose () {
      this.$refs.ruleFormRef.resetFields()
    },
    editUser () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/api/users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.status !== 200) {
          return this.$message.error('修改信息失败！')
        }
        this.editDialogVisible = false
        this.initUserInfo()
        this.$message.success('修改信息成功！')
      })
    },
    editPassword () {
      this.$refs.ruleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/api/users/checkPass', qs.stringify({ password: this.ruleForm.old }))
        if (res.status !== 200) {
          return this.$message.error('原密码错误')
        }
        const { data: response } = await this.$http.post('/api/users/updatePassword', qs.stringify({ password: this.ruleForm.checkpassword }))
        if (response.status !== 200) {
          return this.$message.error('更新失败')
        }
        this.$message.success('密码更新成功')
        return this.$router.push('login')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  width: 400px;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: space-between;
  div {
    margin-bottom: 5px;
  }
}
.el-form-item__content {
  display: flex;
  align-items: center;
  // 垂直居中
}
</style>
