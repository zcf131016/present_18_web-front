<template>
  <div class="sidebar">
    <el-menu
        class="sidebar-el-menu el-menu-vertical-demo"
        :default-active="onRoutes"
        :collapse="this.$store.state.isCollapse"
        background-color="#FAFAFA"
        text-color="#ADADAD"
        active-text-color="#5172D0"
        unique-opened
        router
    >
      <template v-for="item in items">
        <template v-if="item.children.length > 0">
          <el-submenu :index="item.path" :key="item.path">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.children">
              <el-submenu
                  v-if="subItem.children.length > 0"
                  :index="subItem.path"
                  :key="subItem.path"
              >
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item
                    v-for="(threeItem,i) in subItem.children"
                    :key="i"
                    :index="threeItem.path"
                >{{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item
                  v-else
                  :index="subItem.path"
                  :key="subItem.path"
              >{{ subItem.title }}</el-menu-item>
            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.path" :key="item.path" :disabled="item.hidden == '1'">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  data() {
    return {
      isCollapse: true,
      items: []
    };
  },
  methods: {
    collapseChange() {
      this.$store.commit('closeMenu', !this.isCollapse)
      this.isCollapse = !this.isCollapse
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getMenu() {
      let _this = this
      let user_id = localStorage.getItem('user_id')
      getRequest('/menus/user/' + user_id, {}).then(resp => {
        if (resp.data.status == 200) {
          _this.items = resp.data.data
          _this.$store.commit('setMenus', _this.items)
          // console.log('menus form store: ', _this.$store.state.menus)
        }
      })
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '/manageBoard');
    }
  },
  created() {
    this.isCollapse = this.$store.state.isCollapse
    console.log(this.$store.state.isCollapse)
    this.getMenu()
  },
  mounted() {
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: fixed;
  width: 250px;
  margin: 0;
  left: 0;
  top: 70px;
  bottom: 0;
}
.collapse-btn {
  background: #ADADAD;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: fixed;
  font-size: 30px;
  left: 10px;
  bottom: 20px;
  cursor: pointer;
  line-height: 40px;
}
.sidebar::-webkit-scrollbar {
  width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}
.sidebar > ul {
  height: 100%;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
}
</style>
