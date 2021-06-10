<template>
  <div class=" header">
    <div class="logo">
      <img style="height: 50px;width:250px" src="../../assets/finallogo.png" />
    </div>
    <div class="header-right">
      <div class="user-notice">
        <el-popover
            placement="bottom"
            ref="message"
            title="消息"
            width="300"
            trigger="hover"
            content="消息列表">
          <el-table :data="notices">
            <el-table-column property="date" label="日期"></el-table-column>
            <el-table-column property="name" label="姓名"></el-table-column>
            <el-table-column property="content" label="内容"></el-table-column>
          </el-table>
        </el-popover>
          <i v-popover:message class="el-icon-bell notice"></i>
        <el-badge :value="message" class="item" type="warning" />
      </div>
      <div class="user-name">
        {{userInfo.username}}
      </div>
      <div class="user-avatar">
        <el-dropdown @command="handleCommand">
          <el-avatar class="avatar" :size="50" :src="userInfo.avatar"></el-avatar>
                <el-dropdown-menu class="el-dropdown-link" slot="dropdown">
                  <el-dropdown-item command="MyHome">个人主页</el-dropdown-item>
                  <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
                </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import {getRequest} from "@/utils/api";

export default {
  name: "Header",
  data () {
    return {
      collapse: this.$store.state.isCollapse,
      userInfo: {
        username: '',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      },
      notices: [],
      message: 2
    }
  },
  methods: {
    getUserInfo () {
      let _this = this
      let user_id = localStorage.getItem('user_id')
      getRequest('/users/' + user_id, {}).then(resp => {
        let user_info = resp.data.data
        if(resp.data.status == 200) {
          console.log(user_info)
          _this.userInfo.username = user_info.username
          if(user_info.avatar){
            _this.userInfo.avatar = user_info.avatar
          }
          localStorage.setItem('user_info', JSON.stringify(user_info))
        }
      })
    },
    handleCommand(command) {
      let _this = this;
      if (command === 'logout') {
        this.$confirm('注销登录吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function () {
          _this.currentUserName = '游客';
          localStorage.removeItem('access_token')
          _this.$router.replace({path: '/login'});
        }, function () {
          //取消
        })
      }
      if (command === 'MyHome') {
        _this.$store.commit('changeUserDrawer')
        console.log('drawer', _this.$store.state.userDrawer)
      }
    }
  },
  mounted() {
    this.getUserInfo()
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Pattaya&display=swap');
.header-right {
  display: flex;
  position: relative;
  float: right;
  padding-right: 10px;
  height: 70px;
}
.header {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  box-sizing: border-box;
  width: 100%;
  font-size: 22px;
  height: 70px;
  color: #fff;
  background: #2B303B;
  z-index: 2;
}
.user-notice {
  margin-right: 20px;
  line-height: 70px;
  font-size: 25px;
}
.user-name {
  margin-right: 20px;
  line-height: 70px;
  font-family: 'Pattaya', sans-serif;
}
.user-avatar {
  padding-top: 10px;
  padding-bottom: 10px;
}
.logo{
  float: left;
  margin-bottom: 10px;
  margin-top: 10px;
}
.item {
  float: right;
  right: 18px;
  margin-top: -5px;
  margin-left: 10px;
}
.avatar {
  transition: ease-in-out 1s;
}
.avatar:hover {
  cursor: pointer;
  transform: rotate(360deg);
}
.notice {
  transition: ease-in-out 1s;
}
.notice:hover {
  cursor: pointer;
  animation: notice 1s .5s infinite;
}
@keyframes notice {
  20% {
    transform: scale(1.1) rotate(-20deg);
  }
  40% {
    transform: scale(0.9) rotate(20deg);
  }
  60% {
    transform: scale(1.2) rotate(-10deg);
  }
  100% {
    transform: scale(1) rotate(10deg);
  }

}
</style>
