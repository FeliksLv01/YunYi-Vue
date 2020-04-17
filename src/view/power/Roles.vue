<template>
  <div>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row style="margin-bottom: 20px;">
        <el-col>
          <el-button type="primary" @click="dialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',index1 === 0 ? 'bdtop': '','vcenter']"
              v-for="(item1,index1) in scope.row.children" :key="item1.id">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.name}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row :class="[index2 === 0 ? '': 'bdtop','vcenter']" v-for="(item2,index2) in item1.children"
                  :key="item2.id">
                  <el-col>
                    <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">
                      {{item2.name}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="item3 in item2.children" :key="item3.id" closable
                      @close="removeRightById(scope.row,item3.id)">
                      {{item3.name}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="角色描述" prop="description"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRole(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="dialogVisible" width="50%" @close="roleFormClose()">
      <!-- 内容主体区域 -->
      <el-form ref="roleFormRef" :model="roleForm" :rules="roleFormRules" label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="roleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose()">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="editForm.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed()">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" :default-checked-keys="defkeys"
        ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible= false">取 消</el-button>
        <el-button type="primary" @click="allotRights()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data () {
    return {
    // 所有角色列表
      roleList: [],
      rightsList: [],
      dialogVisible: false,
      editDialogVisible: false,
      setRightDialogVisible: false,
      roleForm: {
        name: '',
        description: ''
      },
      editForm: {
        name: '',
        description: ''
      },
      roleFormRules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      editFormRules: {
        name: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      treeProps: {
        label: 'name',
        // function (data, node) {
        //   return data.name
        // },
        children: 'children'
      },
      // 默认选中的节点ID值
      defkeys: [],
      // 即将分配角色的权限id值
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
  // 获取所有角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('/api/roles/tree')
      if (res.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.roleList = res.data
    },
    addRole () {
      this.$refs.roleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/api/roles/addRole', this.roleForm)
        if (res.status !== 200) {
          return this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.dialogVisible = false
        this.getRolesList()
      })
    },
    roleFormClose () {
      this.$refs.roleFormRef.resetFields()
    },
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('/api/roles/' + id)
      if (res.status !== 200) {
        return this.$message.error('查询数据失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editRole () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('/api/roles/' + this.editForm.id, { name: this.editForm.name, description: this.editForm.description })
        if (res.status !== 200) {
          return this.$message.error('修改角色失败！')
        }
        this.editDialogVisible = false
        this.getRolesList()
        this.$message.success('修改角色成功！')
      })
    },
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    async removeRole (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete('/api/roles/' + id)
      if (res.status !== 200) {
        this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.getRolesList()
    },
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`/api/roles/${role.id}/rights/${rightId}`)
      if (res.status !== 200) {
        this.$message.error(res.msg)
      }
      this.$message.success('删除成功')
      role.children = res.data
    },
    async  showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限的设置
      const { data: res } = await this.$http.get('/api/rights/tree')
      if (res.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 把获取到的权限数据放到数据中
      this.rightsList = res.data
      this.getLeafKeys(role, this.defkeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到数组中
    getLeafKeys (node, arr) {
      // 不包含children属性，则是三级节点
      if (node.children.length === 0) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    setRightDialogClosed () {
      this.defkeys = []
    },
    // ...是展开运算符
    async allotRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // 用逗号来拼接
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post('/api/roles/rights', qs.stringify({ id: this.roleId, rids: idStr }))
      if (res.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eeeeee;
}

.bdbottom {
  border-bottom: 1px solid #eeeeee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
