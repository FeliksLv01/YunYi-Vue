<template>
  <div>
    <el-row :gutter="20" type="flex" justify="center">
      <el-col>
        <el-card shadow="hover">
          <div slot="header">
            文件总数
            <i class="fa fa-calculator"></i>
          </div>
          <div class="page-view-totla">
            {{ consoleParam.totalFileCount}}
          </div>
        </el-card>
      </el-col>
      <el-col>
        <el-card shadow="hover">
          <div slot="header">
            文件总大小
            <i class="fa fa-file-archive-o"></i>
          </div>
          <div class="page-view-totla">
            {{ consoleParam.totalFileSize}}
          </div>
        </el-card>
      </el-col>
      <el-col>
        <el-card shadow="hover">
          <div slot="header">
            磁盘总空间<i class="fa fa-cubes"></i>
          </div>
          <div class="page-view-totla">
            {{consoleParam.diskTotalSize}}
          </div>
        </el-card>
      </el-col>
      <el-col>
        <el-card shadow="hover">
          <div slot="header">
            磁盘剩余空间
            <i class="fa fa-cube"></i>
          </div>
          <div class="page-view-totla">
            {{consoleParam.diskFreeSize}}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 第二行 -->
    <el-row :gutter="20" type="flex" justify="center">
      <el-col>
        <el-card shadow="hover" :body-style="{height: '170px',padding: '5px 10px 5px 5px'}">
          <div slot="header">
            快捷操作<i class="el-icon-s-tools" style="float:right"></i>
          </div>
          <a class="shortcut-button" @click="toUpload">
            <span class="shortcut-button-icon"><i class="el-icon-upload" style="font-size: 25px"></i></span>
            <span>文件上传</span>
          </a>
          <a class="shortcut-button" @click="toFileList">
            <span class="shortcut-button-icon"><i class="el-icon-document" style="font-size: 25px"></i></span>
            <span>文件列表</span>
          </a>
          <a class="shortcut-button" @click="removeEmptyDir">
            <span class="shortcut-button-icon"><i class="el-icon-delete" style="font-size: 25px"></i></span>
            <span>删除空目录</span>
          </a>
        </el-card>
      </el-col>
      <el-col>
        <el-card shadow="hover" :body-style="{height: '170px',padding: '5px 10px 5px 5px'}">
          <div slot="header">
            版本信息<i class="el-icon-info" style="float:right"></i>
          </div>

          <table class="console-table">
            <colgroup>
              <col width="200">
              <col>
            </colgroup>
            <tbody>
              <tr>
                <td>当前版本</td>
                <td>
                  <span> {{consoleParam.version }} </span>
                  <a href="https://github.com/kcqnly" style="color: #009688" target="_blank">更新日志</a>
                </td>
              </tr>
              <tr>
                <td>发布日期</td>
                <td>{{ consoleParam.versionDate }}</td>
              </tr>
              <tr>
                <td>操作系统</td>
                <td> {{consoleParam.osName}}</td>
              </tr>
              <tr>
                <td>系统架构</td>
                <td> {{consoleParam.osArch}}</td>
              </tr>
            </tbody>
          </table>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-card>
        <div slot="header" style="fontsize:18;text-align:center;"> 文件统计(30天)</div>
        <div id="main" style="height:400px"></div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data () {
    return {
      consoleParam: {
        totalFileCount: '',
        totalFileSize: '',
        diskTotalSize: '',
        diskFreeSize: '',
        osName: '',
        osArch: '',
        versionDate: '',
        version: '',
        dayNumList: [],
        dayFileSizeList: [],
        dayFileCountList: []
      }
    }
  },
  created () {
    this.getConsoleState()
  },
  mounted () {
    this.initCharts()
  },
  watch: {
    consoleParam (newVal) {
      this.initCharts()
    }
  },
  methods: {
    async getConsoleState () {
      const { data: res } = await this.$http.get('/api/console/state')
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.consoleParam = res.data
    },
    initCharts () {
      var chart = {
        dayNumList: this.consoleParam.dayNumList,
        dayFileCountList: this.consoleParam.dayFileCountList,
        dayFileSizeList: this.consoleParam.dayFileSizeList
      }
      var myChart = echarts.init(document.getElementById('main'))
      myChart.setOption({
        color: ['#445e75', '#45a7ca', '#98d5ef'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{a}:{c}MB<br>{a1}:{c1}'
        },
        legend: {
          data: ['文件大小', '文件数量'],
          top: '20'
        },
        grid: {
          left: '3%',
          right: '4%',
          top: '15%',
          bottom: '11%',
          containLabel: true
        },
        calculable: true,
        xAxis: [{
          type: 'category',
          data: chart.dayNumList
        }],
        yAxis: [{
          type: 'value',
          nameLocation: 'middle',
          nameGap: 30,
          nameTextStyle: {
            fontWeight: 'bold',
            fontSize: '14'
          }
        }],
        series: [{
          name: '文件大小',
          type: 'bar',
          data: chart.dayFileSizeList,
          markPoint: {
            data: [{
              type: 'max',
              name: '最大值'
            }, {
              type: 'min',
              name: '最小值'
            }]
          }
        }, {
          name: '文件数量',
          type: 'bar',
          data: chart.dayFileCountList,
          markPoint: {
            data: [{
              type: 'max',
              name: '最大值'
            }, {
              type: 'min',
              name: '最小值'
            }]
          }
        }]

      })
    },
    toUpload () {
      this.$router.push('upload')
    },
    toFileList () {
      this.$router.push('filelist')
    },
    async removeEmptyDir () {
      const { data: res } = await this.$http.post('/api/console/remove_empty_dir')
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.$message.success(res.msg)
    }
  }

}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.fa {
  float: right;
}

.page-view-totla {
  font-size: 36px;
  color: #666;
  line-height: 36px;
  padding: 5px 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  white-space: nowrap;
}
.console-table {
  border-collapse: collapse;
  border-spacing: 0px;
  width: 100%;
  background-color: #fff;
  color: #666666;
  margin: 5px 0;
}
.console-table tr {
  transition: all 0.3s;
  -webkit-transition: all 0.3s;
}

.console-table th {
  text-align: left;
  font-weight: 400;
}

.console-table td,
.console-table th {
  border-width: 1px;
  border-style: solid;
  border-color: #e6e6e6;
  position: relative;
  padding: 9px 15px;
  min-height: 20px;
  line-height: 20px;
  font-size: 14px;
}
.shortcut-button {
  width: 100px;
  height: 80px;
  display: block;
  float: left;
  margin-left: 10px;
  margin-top: 10px;
  cursor: pointer;
  text-align: center;
  background: rgb(248, 248, 248);
}
.shortcut-button-icon {
  display: block;
  height: 55px;
  text-align: center;
  line-height: 55px;
}
</style>
