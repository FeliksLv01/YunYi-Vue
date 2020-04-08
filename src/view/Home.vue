<template>
  <el-container class="home-container">
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div style="text-align:center">
        <svg t="1586276749157" class="icon" viewBox="0 0 1408 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="1871" width="54px" height="54px">
          <path
            d="M620.8 454.4h19.2c19.2 0 32-12.8 32-32s-12.8-32-32-32h-19.2c-44.8 0-76.8-25.6-76.8-57.6s32-57.6 76.8-57.6c12.8 0 19.2 0 32 6.4 19.2 6.4 38.4-6.4 44.8-25.6 0-19.2 25.6-32 51.2-32 32 0 51.2 19.2 51.2 38.4v6.4c-6.4 19.2 6.4 38.4 25.6 44.8 25.6 6.4 38.4 19.2 38.4 38.4s-25.6 38.4-51.2 38.4h-25.6c-19.2 0-32 12.8-32 32s12.8 32 32 32h25.6c64 0 115.2-44.8 115.2-102.4 0-38.4-25.6-76.8-64-89.6 0-57.6-57.6-102.4-115.2-102.4-44.8 0-83.2 19.2-102.4 57.6h-25.6c-76.8 0-140.8 51.2-140.8 121.6s64 115.2 140.8 115.2zM544 768h-320c-19.2 0-32 12.8-32 32s12.8 32 32 32h320c19.2 0 32-12.8 32-32s-12.8-32-32-32z"
            fill="#909399" p-id="1872"></path>
          <path
            d="M1388.8 716.8v-19.2l-153.6-544C1216 64 1132.8 0 1056 0h-704C275.2 0 192 64 166.4 147.2L12.8 691.2v19.2c-6.4 32-12.8 57.6-12.8 89.6C0 921.6 102.4 1024 224 1024h960c121.6 0 224-102.4 224-224 0-32-6.4-57.6-19.2-83.2zM230.4 166.4C243.2 108.8 300.8 64 352 64h704c51.2 0 102.4 44.8 121.6 102.4l121.6 448c-32-25.6-70.4-38.4-115.2-38.4h-960c-44.8 0-83.2 12.8-115.2 32l121.6-441.6zM1184 960h-960C134.4 960 64 889.6 64 800c0-12.8 0-19.2 6.4-32v-6.4c12.8-70.4 76.8-121.6 153.6-121.6h960c76.8 0 140.8 51.2 153.6 128 0 12.8 6.4 19.2 6.4 32 0 89.6-70.4 160-160 160z"
            fill="#909399" p-id="1873"></path>
          <path
            d="M1120 704c-51.2 0-96 44.8-96 96s44.8 96 96 96 96-44.8 96-96-44.8-96-96-96z m0 128c-19.2 0-32-12.8-32-32s12.8-32 32-32 32 12.8 32 32-12.8 32-32 32z"
            fill="#909399" p-id="1874"></path>
        </svg>
      </div>
      <!-- 侧边栏菜单区域 -->
      <el-menu background-color="#304156" text-color="#fff" active-text-color="#409eff" unique-opened
        :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="acvtivePath">
        <!-- 一级菜单 -->
        <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
          <!-- 模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i :class="iconObj[item.id]"></i>
            <span>{{item.name}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
            @click="saveNavState('/'+subItem.path)">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <span>{{subItem.name}}</span>
            </template>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header>
        <!-- <div class="toggle-button" @click="toggleCollapse">|||</div> -->
        <hamburger :is-active="!isCollapse" class="hamburger-container" @toggleClick="toggleChange()" />

        <div>
          <span>后台管理系统</span>
        </div>
        <el-button type="info" @click="logout"> 退出</el-button>
      </el-header>
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Hamburger from '../components/Hamburger'
export default {
  components: {
    Hamburger
  },
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconObj: {
        101: 'iconfont icon-mn_baobiao_fill',
        102: 'iconfont icon-users',
        110: 'iconfont icon-tijikongjian',
        122: 'iconfont icon-wenjian',
        127: 'iconfont icon-setting'

      },

      isCollapse: false,
      // 被激活的连接地址
      acvtivePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.acvtivePath = window.sessionStorage.getItem('acvtivePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('login')
    },
    async getMenuList () {
      // 将data去处 重定向为res
      const { data: res } = await this.$http.get('/api/menus')
      if (res.status !== 200) {
        return this.$message.error(res.msg)
      }
      this.menuList = res.data
    },
    toggleChange () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (acvtivePath) {
      window.sessionStorage.setItem('acvtivePath', acvtivePath)
      this.acvtivePath = acvtivePath
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #97a8be;
  font-size: 18px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #304156;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eff1f4;
}
.iconfont {
  margin-right: 10px;
}
.hamburger-container {
  line-height: 46px;
  height: 100%;
  float: left;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;

  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
.breadcrumb-container {
  float: left;
}
.iconfont {
  margin-right: 10px;
}
</style>
