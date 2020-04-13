<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>上传配置</span>
          </div>
          <div class="inputlist">
            <div class="input">
              <div class="title">路径：</div>
              <el-input placehold="请输入路径" v-model="path"></el-input>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" class="fileupload-bottom">
        <el-card class="uploadcard">
          <el-upload ref="upload" drag :action="url" :headers="headers" multiple :show-file-list="true">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      path: 'default',
      fileList: [],
      headers: {
        Authorization: 'Bearer ' + window.sessionStorage.getItem('token')
      },
      url: '/api/file/upload/default'
    }
  },
  watch: {
    path (newval) {
      this.url = '/api/file/upload/' + newval
    }
  }
}
</script>

<style lang="less" scoped>
.uploadcard {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.input {
  width: 100%;
  height: 50px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
}
.title {
  width: 5%;
  text-align: left;
}
.inputlist {
  display: flex;
  flex-direction: column;
}
.fileupload-bottom {
  margin-top: 10px;
}
</style>
