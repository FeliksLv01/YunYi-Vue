<template>
  <el-container class="home-container">
    <el-aside :width="isCollapse ? '64px' : '200px'">

      <!-- 侧边栏菜单区域 -->
      <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff" unique-opened
        :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="acvtivePath">
        <!-- 一级菜单 -->
        <el-submenu :index="item.id+''" v-for="(item,index) in menuList" :key="item.id">
          <!-- 模板区域 -->
          <template slot="title">
            <!-- 图标 -->
            <i :class="iconObj[index]"></i>
            <span>{{item.authName}}</span>
          </template>
          <!-- 二级菜单 -->
          <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id"
            @click="saveNavState('/'+subItem.path)">
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <span>{{subItem.authName}}</span>
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
          <!-- <img src="../assets/logo.png" alt=""> -->
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
      iconObj: [
        'iconfont icon-user',
        'iconfont icon-tijikongjian',
        'iconfont icon-shangpin',
        'iconfont icon-danju',
        'iconfont icon-baobiao'
      ],
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
      const { data: res } = await this.$http.get('/menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
      console.log(this.menuList)
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
</style>
