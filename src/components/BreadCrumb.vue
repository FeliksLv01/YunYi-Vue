<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item v-if='parentTitle'> <a href="javascript:;"> {{parentTitle}} </a> </el-breadcrumb-item>
    <el-breadcrumb-item v-if='title'>{{title}}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  data () {
    return {
      parentTitle: '',
      title: ''
    }
  },
  created () {
    this.setIndex()
  },
  watch: {
    $route () {
      this.setIndex()
    }
  },
  methods: {
    setIndex () {
      this.parentTitle = this.$route.meta.parentTitle
      this.title = this.$route.meta.title
    }
  }
}
</script>

<style lang="less" scoped>
</style>
