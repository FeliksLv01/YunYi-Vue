<template>
  <div class="filelist">
    <el-card>
      <div slot="header">
        <div class="bread">
          <el-breadcrumb separator="/" style="font-size:12px;margin-top:3px">
            <el-breadcrumb-item><a href="javascript:;" @click="getParentFile()"> 全部文件</a> </el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,index) in pathlist" :key="index">
              <a href="javascript:;" @click="listChange(index)">{{ item }}</a>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-button style="float: right; padding: 10px 10px" type="primary" @click="gotoUpload()">上传文件</el-button>
      </div>
      <div class="bottom">
        <el-table :data="filelist">
          <el-table-column label="文件名" width="400px">
            <!-- 模板区域 -->
            <template slot-scope="scope">
              <!-- 图标 -->
              <div @click="getDirFile(scope.row)" style="cursor: pointer;">
                <svg class="icon" aria-hidden="true">
                  <use :xlink:href="iconObj[scope.row.type]" v-if="iconObj[scope.row.type]"></use>
                  <use :xlink:href="iconObj['unkonwn']" v-if="!iconObj[scope.row.type]"> </use>
                </svg> <span style="font-size:16px">
                  {{scope.row.name}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="大小" prop="size">
          </el-table-column>
          <el-table-column label="创建时间" prop="mtime">
          </el-table-column>
          <el-table-column label="操作" width="300px">
            <template slot-scope="scope" v-if="scope.row.type!=='directory'">
              <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
              <el-button size="mini" type="success" @click="handleDelete(scope.$index, scope.row)">下载</el-button>
              <el-button size="mini" type="danger" @click="deletefile(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      filelist: [],
      pathlist: [],
      iconObj: {
        directory: '#icon-wenjianjia',
        jpg: '#icon-tupian',
        zip: '#icon-zip',
        pdf: '#icon-pdf',
        xlsx: '#icon-Microsoft-Excel',
        exe: '#icon-exe',
        docx: '#icon-WORD',
        mp3: '#icon-file_music',
        txt: '#icon-txt',
        mp4: '#icon-videos',
        html: '#icon-chrome',
        java: '#icon-java',
        py: '#icon-python',
        unkonwn: '#icon-icon_weizhiwenjian'
      }

    }
  },
  created () {
    this.getParentFile()
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
    async deletefile (fileinfo) {
      const { data: res } = await this.$http.delete(`/api/file/delete/${fileinfo.md5}`)
      if (res.status !== 200) {
        return this.$message.error('删除失败')
      }

      this.filelist.splice(this.filelist.indexOf(fileinfo), 1)
      return this.$message.success('删除成功')
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
</style>
