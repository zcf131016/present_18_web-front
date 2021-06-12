<template>
  <div>
    <el-drawer
        :visible.sync="drawer"
        direction="rtl"
        :with-header="false"
        size="50%">
      <el-tabs style="margin-left: 20px;margin-right: 20px;position: absolute;top: 10px;width: 95%" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="我的信息" name="first">
          <div id="user-info-head">
            <div class="user-profile-box">
              <div class="user-profile-left">
                <img :src="userInfo.avatar" alt="">
                <div class="fontsize-14 user-name-box">
                  <div class="out-hide" style="max-width:300px;">{{userInfo.realname}}</div>
                  <div class="clear15"></div>
                  <div>{{userInfo.number}}</div>
                </div>
              </div>

              <div class="user-profile-right">
                <div style="float:left;width:200px;">
                  <div class="fontsize-14">经验值</div>
                  <div class="clear15"></div>
                  <div style="font-size:24px;color:#FC0;">177</div>
                </div>

                <div style="width:1px;height:60px;background-color:#5DBAAA;float:left;"></div>

                <div style="float:right;width:200px;">
                  <div class="fontsize-14">魅力值</div>
                  <div class="clear15"></div>
                  <div style="font-size:24px;color:#FC0;">0</div>
                </div>
              </div>
            </div>
          </div>
          <div class="my-info">
            <table border="1" class="user-teacher">
              <tbody><tr style="height:150px;">
                <td>
                  <img src="https://static-cdn-oss.mosoteach.cn/mosoteach2/common/images/personal-center-icon-cloud.png" alt="">
                  <div class="text-align-vertical">
                    <span class="fontsize-14 color-66">创建班课</span>
                    <div class="clear20"></div>
                    <span class="color-66" style="font-size:28px;">{{relatedInfo.class_info}}</span>
                  </div>
                </td>
                <td>
                  <img src="https://static-cdn-oss.mosoteach.cn/mosoteach2/common/images/personal-center-icon-member.png" alt="">
                  <div class="text-align-vertical">
                    <span class="fontsize-14 color-66">累计学生</span>
                    <div class="clear20"></div>
                    <span class="color-66" style="font-size:28px;">{{relatedInfo.student_info}}</span>
                  </div>
                </td>
                <td>
                  <img src="https://static-cdn-oss.mosoteach.cn/mosoteach2/common/images/personal-center-icon-resource.png" alt="">
                  <div class="text-align-vertical">
                    <span class="fontsize-14 color-66">发布资源</span>
                    <div class="clear20"></div>
                    <span class="color-66" style="font-size:28px;">{{relatedInfo.resource_info}}</span>
                  </div>
                </td>
                <td>
                  <img src="https://static-cdn-oss.mosoteach.cn/mosoteach2/common/images/personal-center-icon-exercise.png" alt="">
                  <div class="text-align-vertical">
                    <span class="fontsize-14 color-66">开展活动</span>
                    <div class="clear20"></div>
                    <span class="color-66" style="font-size:28px;">{{relatedInfo.active_info}}</span>
                  </div>
                </td>
              </tr>
              <tr>
                <td colspan="4">
                  <div class="clear20"></div>
                  <div id="line-graph-title">
                    <div class="fontsize-14 color-33">
                      <span>共发起签到</span>
                      <span style="color:#FF6555;">{{relatedInfo.sign_info}}</span>
                      <span>次， 总平均出勤率</span>
                      <span style="color:#FF6555;">0%</span>
                    </div>
                    <div class="clear10"></div>
                    <div class="fontsize-12 color-66">
                      <span>按天统计平均值，最多显示最近100条</span>
                    </div>
                    <div class="no-data" style="height:92px;  font-size:12px;  color:#999; padding-top:60px;">
                      暂无签到数据
                    </div>
                  </div>
                  <div id="line-graph" style="height: 300px; display: none; -webkit-tap-highlight-color: transparent; user-select: none; position: relative; background-color: transparent;" _echarts_instance_="ec_1619487788801"><div style="position: relative; overflow: hidden; width: 0px; height: 300px;"><canvas width="0" height="300" data-zr-dom-id="zr_0" style="position: absolute; left: 0px; top: 0px; width: 0px; height: 300px; user-select: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);"></canvas></div><div></div></div>
                  <div class="clear20"></div>
                </td>
              </tr>
              </tbody></table>
          </div>
        </el-tab-pane>
        <el-tab-pane label="用户信息" name="second">
          <div class="user-info-form">
            <div class="user-avatar">
              <img v-if="userInfo.avatar!=null" :src="userInfo.avatar" alt="" class="avatar">
              <img v-if="userInfo.avatar==null" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" alt="" class="avatar">
              <div class="user-edit">
                <el-button type="primary" size="small" plain round>更换头像</el-button>
                <el-button type="primary" size="small" plain round @click="innerDrawer = true; UserForm = userInfo">修改信息</el-button>
              </div>
            </div>
            <div class="profile-box">
              <div class="info-item">
                <label class="info-label">账号</label>
                <span title="">{{userInfo.phone}}</span>
              </div>
              <div class="info-item">
                <label class="info-label">姓名</label>
                <span title="">{{userInfo.realname}}</span>
              </div>
              <div class="info-item">
                <label class="info-label">昵称</label>
                <span title="">{{userInfo.username}}</span>
              </div>
              <div class="info-item">
                <label class="info-label">性别</label>
                <span title="">{{userInfo.sex}}</span>
              </div>
              <div class="info-item">
                <label class="info-label">身份</label>
                <span title="">{{userInfo.role}}</span>
              </div>
              <div class="info-item">
                <label class="info-label">工号/学号</label>
                <span title="">{{userInfo.number}}</span>
              </div>
              <div class="info-item">
                <label class="info-label">所在的学校</label>
                <span title="">{{userInfo.school}}</span>
              </div>

              <div class="info-item">
                <label class="info-label">所在的院系</label>
                <span title="">{{userInfo.college}}</span>
              </div>

            </div>
          </div>
          <el-dialog
              title="编辑用户信息"
              append-to-body
              width="500px"
              :visible.sync="innerDrawer"
              center>
            <el-form :model="UserForm" :rules="rules">
              <el-form-item label="用户名" label-width="60px" prop="username">
                <el-input v-model="UserForm.username" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="昵称" label-width="60px">
                <el-input v-model="UserForm.nickname" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="手机号" label-width="60px" prop="phone">
                <el-input v-model="UserForm.phone" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" label-width="60px">
                <el-input v-model="UserForm.email" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="学号" label-width="60px">
                <el-input v-model="UserForm.number" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="学校" label-width="40px" style="width: 100%">
                <el-select v-model.number="UserForm.schoolId" placeholder="学校" @change="getColleges(UserForm.schoolId)" style="width: 160px">
                  <el-option
                      v-for="item in universities"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model.number="UserForm.collegeId" placeholder="学院" style="margin-left: 5px">
                  <el-option
                      v-for="item in colleges"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="innerDrawer = false">取 消</el-button>
              <el-button type="primary" @click="editUser">确 定</el-button>
            </div>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="账户安全" name="third">
          <div class="relation-type-box">
            <div class="relation-item">
              <img src="https://www.mosoteach.cn/web/common/images/my-center-icon_phone.png" alt="" class="rel-img">
              <div class="rel-desc">
                <div class="rel-info">
                  <span style="color:#333;font-size: 14px;font-weight: bold;margin-right: 10px;">关联手机</span>
                  <span style="color:#ff5500;font-size: 14px">{{userInfo.phone}}</span>
                </div>
                <div class="info-detail">
                  <p>· 关联手机后可使用手机号加密码登录，也可使用短信验证登录</p>
                  <p>· 密码丢失时可以通过手机轻松找回</p>
                </div>
              </div>
              <div class="rel-option">
                <el-button type="primary" plain size="small">更换关联</el-button>
              </div>
            </div>
            <hr class="style-line" />
            <div class="relation-item">
              <img src="https://www.mosoteach.cn/web/common/images/my-center-icon_mail.png" alt="" class="rel-img">
              <div class="rel-desc">
                <div class="rel-info">
                  <span style="color:#333;font-size: 14px;font-weight: bold;margin-right: 10px;">关联邮箱</span>
                  <span style="color:#ff5500;font-size: 14px">{{userInfo.email!=null ? userInfo.email : '未关联'}}</span>
                </div>
                <div class="info-detail">
                  <p>· 关联手机后可使用邮箱加密码登录</p>
                  <p>· 密码丢失时可以通过邮箱轻松找回</p>
                </div>
              </div>
              <div class="rel-option">
                <el-button type="primary" plain size="small">更换关联</el-button>
              </div>
            </div>
            <hr class="style-line" />
            <div class="relation-item">
              <img src="https://www.mosoteach.cn/web/common/images/my-center-icon_password.png" alt="" class="rel-img">
              <div class="rel-desc">
                <div class="rel-info">
                  <span style="color:#333;font-size: 14px;font-weight: bold;margin-right: 10px;">修改密码</span>
                </div>
                <div class="info-detail">
                  <p>· 为了你的账号安全，请不要向他人透露账号密码</p>
                </div>
              </div>
              <div class="rel-option">
                <el-button type="primary" plain size="small">修改密码</el-button>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-drawer>
  </div>
</template>

<script>
import {getRequest, putRequest} from "@/utils/api";

export default {
  name: "UserInfo",
  data() {
    return {
      rules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        phone: [{required: true, message: '请输入手机号', trigger: 'blur'}]
      },
      activeName: 'first',
      tabPosition: 'left',
      innerDrawer: false,
      universities: [],
      colleges: [],
      userInfo: {
        realname: '',
        phone: '',
        username: '',
        sex: '',
        school: '',
        college: '',
        role: '',
        number: '',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      },
      UserForm: {
        collegeId: 0,
        enable: true,
        id: 0,
        nickname: "",
        number: "",
        schoolId: 0,
        sex: "",
        username: ""
      },
      relatedInfo: {
        class_info: '3',
        student_info: '126',
        resource_info: '8',
        active_info: '2',
        sign_info: '',
        sign_in_info: ''
      }
    }
  },
  methods: {
    editUser() {
      let _this = this
      putRequest('/users', _this.UserForm).then(resp => {
        _this.$message({
          type: 'success',
          message: resp.data.msg
        })
      })
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getUserInfo() {
      this.userInfo = JSON.parse(localStorage.getItem('user_info'))
      if (this.userInfo.avatar == null) {
        this.userInfo.avatar = 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
      }
      if (this.userInfo.realname == null) {
        this.userInfo.realname = '未命名'
      }
      switch (this.userInfo.role) {
        case "ROLE_ADMIN":
          this.userInfo.role = '管理员'
          break
        case "ROLE_TEACHER":
          this.userInfo.role = '教师'
          break
        default:
          this.userInfo.role = '学生'
          break
      }
      console.log('user',this.userInfo)
    },
    getUniversity: function () {
      let _this = this
      getRequest('/universities',{
        id: 1,
        pageNum: 1,
        pageSize: 500
      }).then(resp => {
        if (resp.status == 200) {
          _this.universities = resp.data.data
          console.log(_this.universities)
        } else {
          console.log('获取学校信息失败！')
        }
      })
    },
    getColleges: function (schoolId) {
      let _this = this
      getRequest('/universities/' + schoolId, {
        id: schoolId,
        pageNum: 1,
        pageSize: 500
      }).then( resp => {
        if (resp.status == 200) {
          _this.colleges = resp.data.data
          console.log(_this.colleges)
        } else {
          console.log('获取学院信息失败!')
        }
      })
    },
  },
  mounted() {
    this.getUserInfo()
    this.getUniversity()
  },
  created() {
  },
  computed: {
    drawer: {
      get () {
        return this.$store.state.userDrawer
      },
      set () {
        this.$store.commit('changeUserDrawer')
      }
    }
  }
}
</script>

<style scoped>
.user-edit {
  margin-top: 20px;
}
.user-info-form {
  display: flex;
  width: 100%;
}
.user-avatar {
  flex: 1;
  padding: 10px
}
.avatar {
  barder-radius: 20px;
}
.profile-box {
  flex: 4;
  margin-left: 5px;
  border-left:thick dotted lightgray;
}
.info-item {
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  display: flex;
  margin-bottom: 20px;
  align-items: center;
}
.info-item .info-label {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  display: inline-block;
  width: 130px;
  text-align: right;
  margin-right: 30px;
}
.relation-type-box {
  text-align: left;
}
.relation-item {
  margin-top: 10px;
}
.rel-img {
  vertical-align:middle;
  margin-right:30px;
  float: left;
}
.rel-option {
  float:right;
  margin:26px 0;
}
.rel-desc {
  display:inline-block;
  vertical-align:middle;
  text-align: left;
}
.rel-info {

}
.info-detail {
  display: inline-block;
  border-radius: 50%;
  vertical-align: middle;
  float: left;
}
hr.style-line {
  border: 0;
  height: 1px;
  width: 100%;
  background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
}
.my-info {
  width: 100%;
  margin-top: 10px;
}
.user-teacher {
  width: 100%;
}
.text-align-vertical {
  vertical-align: middle;
}
table {
  border-collapse: collapse;
}
.user-profile-box {
  width: 100%;
  height: 80px;
  padding-top: 20px;
  color: #FFF;
  background-image: url(https://www.mosoteach.cn/web/common/images/personal-center-headerView.png);
}
.user-profile-left {
  float: left;
  padding-left: 30px;
}
.user-name-box {
  float: left;
  margin-left: 20px;
  margin-top: 5px;
}
.fontsize-14 {
  font-size: 14px;
}
.out-hide {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
}
.clear15 {
  clear: both;
  height: 15px;
  line-height: 0px;
  font-size: 0px;
  overflow: hidden;
  visibility: hidden;
}
.user-profile-left img {
  border-radius: 50%;
  width: 60px;
  float: left;
}
.user-profile-right {
  float: right;
  text-align: center;
}
.user-name-box {
  float: left;
  margin-left: 20px;
  margin-top: 5px;
}
</style>
