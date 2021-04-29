<template>
  <div class="router-info">
    <span class="collapse-btn" @click="collapseChange">
      <i v-if="!this.$store.state.isCollapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </span>
    <el-breadcrumb separator-class="el-icon-arrow-right" class="router">
      <el-breadcrumb-item
          v-for="(item,index) in breadList"
          :key="index"
          :to="{ path: item.path }"
      >{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "BreadCrumb",
  data() {
    return {
      breadList: [],
      isCollapse: true
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  methods: {
    isHome(route) {
      return route.name === "home";
    },
    collapseChange() {
      this.$store.state.isCollapse = !this.$store.state.isCollapse
    },
    getBreadcrumb() {
      let matched = this.$route.matched;
      //如果不是首页
      if (!this.isHome(matched[0])) {
        matched = [{ path: "/", meta: { title: "首页" } }].concat(matched);
      }
      this.breadList = matched;
    }
  },
  created() {
    this.getBreadcrumb();
  }
}
</script>

<style scoped>
.router-info {
  display: flex;
  width: 100%;
  height: 20px;
  line-height: 20px;
  margin-left: 0px;
  padding-left: 0px;
  padding-top: 10px;
  padding-right: 10px;
  padding-bottom: 10px;
  background: #FAFAFA;
}
.collapse-btn {
  font-size: 18px;
  line-height: 20px;
  font-weight: 400;
}
.router {
  font-size: 14px;
  line-height: 20px;
}
</style>
