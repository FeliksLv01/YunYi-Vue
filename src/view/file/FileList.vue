<template>
  <div class="filelist">
    <el-card>
      <div slot="header" class="card-head">
        <div class="bread">
          <el-breadcrumb separator="/" style="font-size:12px;">
            <el-breadcrumb-item><a href="javascript:;" @click="getParentFile()"> 全部文件</a> </el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in pathlist" :key="index">
              <a href="javascript:;" @click="listChange(index)">{{ item }}</a>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-button type="primary" @click="gotoUpload()">上传文件</el-button>
      </div>
      <div class="bottom">
        <el-table :data="filelist">
          <el-table-column label="文件名" width="400px">
            <!-- 模板区域 -->
            <template slot-scope="scope">
              <!-- 图标 -->
              <div @click="getDirFile(scope.row)" style="cursor: pointer;">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="iconName(scope.row.type)"></use>
                </svg>
                <span style=" font-size:16px"> {{scope.row.name}} </span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="大小" prop="size">
          </el-table-column>
          <el-table-column label="创建时间" prop="mtime">
          </el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope" v-if="scope.row.type!=='directory'">
              <el-button size="mini" type="primary" @click="showDetail(scope.row.md5)">详情</el-button>
              <el-button size="mini" type="success" @click="downloadfile(scope.row.path,scope.row.name)">下载</el-button>
              <el-button size="mini" type="danger" @click="deletefile(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <el-dialog title="文件详情" :visible.sync="detailVisable" width="30%">
      <div>
        <p><b>名称：</b>{{ fileDetails.name }}</p>
        <p><b>文件路径：</b>{{ fileDetails.path }}</p>
        <p><b>大小：</b>{{ fileDetails.size }} </p>
        <p><b>创建时间：</b>{{ fileDetails.timeStamp }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import qs from 'qs'
import * as fileUtil from '@/utils/fileUtil'
export default {
  data () {
    return {
      filelist: [],
      pathlist: [],
      detailVisable: false,
      fileDetails: {},
      previewVisible: false,
      dialogImageUrl: ''
    }
  },
  created () {
    this.getParentFile()
  },
  computed: {
    iconName () {
      return function (type) {
        const iconName = fileUtil.getIconName(type)
        return iconName
      }
    }
  },
  methods: {
    gotoUpload () {
      this.$router.push('upload')
    },
    // 获取一级目录
    async getParentFile () {
      const { data: res } = await this.$http.get('/api/file/getParentFile')
      if (res.status !== 200) {
        return this.$message.error('获取文件列表失败')
      }
      this.filelist = res.data
    },
    // 根据目录获取
    async getDirFile (fileInfo) {
      if (fileInfo.type !== 'directory') { return }
      let url = ''
      if (fileInfo.path === '') {
        url = fileInfo.name
      } else {
        url = fileInfo.path + '/' + fileInfo.name
      }
      const { data: res } = await this.$http.get('/api/file/getDirFile', { params: { dir: url } })
      if (res.status !== 200) {
        return this.$message.error('获取文件列表失败')
      }
      this.pathlist = url.split('/')
      this.filelist = res.data
    },
    async listChange (index) {
      let url = ''
      for (let i = 0; i < index; i++) {
        url += this.pathlist[i] + '/'
      }
      url += this.pathlist[index]
      const { data: res } = await this.$http.get('/api/file/getDirFile', { params: { dir: url } })
      if (res.status !== 200) {
        return this.$message.error('获取文件列表失败')
      }
      this.filelist = res.data
    },
    // 获取文件详情
    async showDetail (key) {
      const { data: res } = await this.$http.post('/api/file/details', qs.stringify({ md5: key }))

      if (res.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.fileDetails = res.data
      this.detailVisable = true
    },
    async deletefile (fileInfo) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete(`/api/file/delete/${fileInfo.md5}`)
      if (res.status !== 200) {
        return this.$message.error('删除失败')
      }

      this.filelist.splice(this.filelist.indexOf(fileInfo), 1)
      return this.$message.success('删除成功')
    },
    downloadfile (path, name) {
      const params = {
        path: path,
        name: name
      }
      this.$http({
        url: '/api/file/downloadFile',
        method: 'get',
        params: params,
        responseType: 'blob' // 接收类型设置，否者返回字符型
      }).then(res => { // 定义文件名等相关信息
        const blob = res.data
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onload = (e) => {
          const a = document.createElement('a')
          a.download = name
          a.href = e.target.result
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })

      return this.$message.success('成功开始下载......')
    }

  }
}
</script>

<style lang="less" scoped>
.icon {
  width: 2em;
  height: 2em;
  vertical-align: -0.4em;
  fill: currentColor;
  overflow: hidden;
  margin-right: 5px;
}
.el-button {
  font-size: 16px;
}
.el-table {
  margin-bottom: 10px;
  font-size: 16px;
}
.bread a {
  color: #606266;
}
.bread a:hover {
  color: #000000;
}
.card-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
