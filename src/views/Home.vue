<template>
  <el-container>
    <div class="wrapper">
      <y-header></y-header>
      <y-sidebar></y-sidebar>
      <div :class="{'content-box':!this.$store.state.isCollapse, 'content-collapse' : this.$store.state.isCollapse}">
        <BreadCrumb></BreadCrumb>
        <Tag></Tag>
        <div class="content">
          <transition>
            <keep-alive>
              <router-view v-if="this.$route.meta.keepAlive"></router-view>
            </keep-alive>
          </transition>
        </div>
        <Copyright></Copyright>
      </div>
    </div>
    <UserInfo></UserInfo>

  </el-container>
</template>

<script>
// @ is an alias to /src
import ySidebar from "@/components/Sidebar";
import yHeader from "@/components/Header";
import BreadCrumb from "@/components/BreadCrumb";
import UserInfo from "@/components/UserInfo";
import Tag from "@/components/Tags";
import Copyright from "@/components/widgets/Copyright";

export default {
  name: 'Home',
  components: {
    ySidebar,
    yHeader,
    BreadCrumb,
    UserInfo,
    Tag,
    Copyright
  },
  data() {
    return {
      currentUserName: 'Admin',
      input: ''
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  },
  created() {
    this.collapse = this.$store.state.isCollapse
  }
}
</script>

<style>
  @import url("//unpkg.com/element-ui@2.15.1/lib/theme-chalk/index.css");
  .wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .content-collapse {
    position: absolute;
    left: 80px;
    right: 10px;
    top: 70px;
    bottom: 0;
    margin: 0;
    padding: 0;
    -webkit-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out;
    background: #fafafa;
    overflow: hidden;
  }
  .content-box {
    position: absolute;
    left: 260px;
    top: 70px;
    right: 10px;
    bottom: 0;
    margin: 0;
    padding: 0;
    -webkit-transition: left .3s ease-in-out;
    transition: left .3s ease-in-out;
    background: #fafafa;
    overflow: hidden;
  }
  .content {
    width: auto;
    height: 100%;
    padding: 10px;
    /*overflow-y: scroll;*/
    box-sizing: border-box;
  }
  .el-select .el-input {
    width: 130px;
  }
  .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
  .el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .icp-info a {
    color: #505458;
  }

  /*::-webkit-scrollbar {*/
  /*  !*隐藏滚轮*!*/
  /*  display: none;*/
  /*}*/
</style>
