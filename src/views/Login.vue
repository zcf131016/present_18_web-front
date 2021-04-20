<template>
  <body id="paper">
    <div>
        <!--  账号密码登录-->
        <el-form v-if="this.mode==='login'" ref="form" :model="loginForm" :rules="rules" class="login-container" label-position="left"
                label-width="0px" v-loading="loading">
            <h1 class="login_title">到云后台系统登录</h1>
            <el-form-item prop="username">
            <el-input type="string" v-model="loginForm.username" auto-complete="off" placeholder="用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码" show-password></el-input>
            </el-form-item>
            <el-form-item  prop="smsCode">
              <el-row :gutter="10">
                <el-col :span="16">
                  <el-input type="string" v-model="loginForm.smsCode" autocomplete="off" placeholder="验证码" @change="verifyCode"></el-input>
                </el-col>
                <el-col :span="8">
                  <div class="login-code" @click="refreshCode">
                    <!--验证码组件-->
                    <SIdentify :identifyCode="identifyCode"></SIdentify>
                  </div>
                </el-col>
              </el-row>
            </el-form-item>
            <el-checkbox class="login_remember" v-model="checked" label-position="left">记住密码</el-checkbox>
            <el-link @click="onChangeMode('loginbyphone')" style="float: right">手机验证码登录</el-link>
            <el-form-item style="width: 100%">
            <el-button type="info" @click.native.prevent="onLogin" style="width: 100%" :disabled="!verify">登录</el-button>
            </el-form-item>
          <div style="padding-bottom: 20px">
            <el-link style="float: left" @click="onChangeMode('register')">注册账号</el-link>
            <el-link style="float: right;" @click="onChangeMode('forgot')">忘记密码</el-link>
          </div>
        </el-form>
<!--      手机验证码登录-->
      <el-form v-else-if="this.mode==='loginbyphone'" :rules="rules" class="login-container" label-position="left"
               label-width="0px" v-loading="loading" :model="loginByPhoneForm">
        <h1 class="login_title">手机验证码登录</h1>
        <el-form-item prop="phone">
          <el-input type="text" v-model="loginByPhoneForm.phone" auto-complete="off" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item  prop="smsCode">
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input type="string" v-model="loginByPhoneForm.smsCode" autocomplete="off" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="info" @click="getMsgCode(loginByPhoneForm.phone)" :disabled="disabledCodeBtn">{{codeText}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button type="info" @click.native.prevent="onLoginByPhone" style="width: 100%">登录</el-button>
        </el-form-item>
        <div>
          <el-link @click="onChangeMode('login')">账号密码登录</el-link>
        </div>
      </el-form>
<!--      注册-->
      <el-form v-else-if="this.mode==='register'" :rules="rules" class="login-container" label-position="left"
               label-width="0px" v-loading="loading" :model="registerForm">
        <h1 class="login_title">注册</h1>
        <el-form-item prop="username">
          <el-input type="string" v-model="registerForm.username" auto-complete="off" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input type="string" v-model="registerForm.phone" auto-complete="off" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="number">
          <el-input type="string" v-model="registerForm.number" auto-complete="off" placeholder="学号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="registerForm.password" auto-complete="off" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item  prop="smsCode">
          <el-row :gutter="10">
            <el-col :span="15">
              <el-input type="string" v-model="registerForm.smsCode" autocomplete="off" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="info" @click="getMsgCode(registerForm.phone)" :disabled="disabledCodeBtn">{{codeText}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="学校" label-width="40px" style="width: 100%">
          <el-select v-model.number="registerForm.schoolId" placeholder="学校" @change="getColleges(registerForm.schoolId)">
            <el-option
                v-for="item in universities"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model.number="registerForm.collegeId" placeholder="学院">
            <el-option
                v-for="item in colleges"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别" label-width="40px">
          <el-radio v-model="registerForm.sex" label="男">男</el-radio>
          <el-radio v-model="registerForm.sex" label="女">女</el-radio>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button type="info" @click.native.prevent="onRegister" style="width: 100%">注册</el-button>
        </el-form-item>
        <div>
          <el-link @click="onChangeMode('login')">前往登录</el-link>
        </div>
      </el-form>
<!--      忘记密码-->
      <el-form v-else :rules="rules" class="login-container" label-position="left"
               label-width="0px" v-loading="loading" :model="forgotForm">
        <h1 class="login_title">修改密码</h1>
        <el-form-item prop="phone">
          <el-input type="text" v-model="forgotForm.phone" auto-complete="off" placeholder="手机号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="forgotForm.password" auto-complete="off" placeholder="密码" show-password></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="forgotForm.password1" auto-complete="off" placeholder="确认密码" show-password></el-input>
        </el-form-item>

        <el-form-item  prop="smsCode">
          <el-row :gutter="10">
            <el-col :span="18">
              <el-input type="string" v-model="registerForm.smsCode" autocomplete="off" placeholder="验证码"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button type="info" @click="getMsgCode(forgotForm.phone)" :disabled="disabledCodeBtn">{{codeText}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="width: 100%">
          <el-button type="info" @click.native.prevent="onModifyPassword" style="width: 100%">提交更改</el-button>
        </el-form-item>
        <div>
          <el-link @click="onChangeMode('login')">前往登录</el-link>
        </div>
      </el-form>
    </div>
  </body>
</template>
<script>
import {postRequest, getRequest, putRequest} from '../utils/api'
  import SIdentify from "@/components/Identify";
  export default{
    name: 'Login',
    components: {
      SIdentify
    },
    data(){
      // 自定义手机号验证
      let checkPhone = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('手机号不能为空'));
        } else {
          const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
          console.log(reg.test(value));
          if (reg.test(value)) {
            callback();
          } else {
            return callback(new Error('请输入正确的手机号'));
          }
        }
      };
      return {
        // 这里定义数据
        rules: {
          phone: [{validator: checkPhone, trigger: 'blur'}],
          username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'}],
          number: [{required: true, message: '请输入学号', trigger: 'blur'}],
          smsCode: [{ required: true, message: '验证码不能为空'},
                    {pattern: '/[a-zA-Z0-9}$/',message: '验证码只能为数字或字母',trigger: 'blur' }]
        },
        checked: false,
        msgValidate: false,
        mode: 'login',
        loginForm: {
          username: '',
          password: '',
          smsCode: ''
        },
        loginByPhoneForm: {
          phone: '',
          smsCode: ''
        },
        registerForm: {
          username: '',
          phone: '',
          password: '',
          smsCode: '',
          roleId: 1,
          sex: '男',
          schoolId: 1,
          collegeId: null
        },
        forgotForm: {
          phone: '',
          password: '',
          password1: '',
          smsCode: ''
        },
        universities: [],
        colleges: [],
        loading: false,
        identifyCodes: '1234567890',
        identifyCode: '',
        disabledCodeBtn: false,
        codeText: '获取',
        verify: false
      }
    },
    methods: {
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
      onChangeMode: function (mode) {
        this.mode = mode
      },
      // 注册接口
      onRegister: function () {
        let _this = this
        this.loading = true
        postRequest('/users', {
          "code": this.registerForm.smsCode,
          "password": this.registerForm.password,
          "phone": this.registerForm.phone,
          "roleId": this.registerForm.roleId,
          "username": this.registerForm.username,
          "schoolId": this.registerForm.schoolId,
          "sex": this.registerForm.sex,
          "collegeId": this.registerForm.collegeId,
          "number": this.registerForm.number
        }).then(resp => {
          _this.loading = false;
          switch (resp.data.status) {
            case 200:
              _this.$alert(resp.data.msg)
              break
            case 500:
              _this.$alert(resp.data.msg)
              break
            case 400:
              _this.$alert(resp.data.msg)
              break
          }
        })
      },
      onModifyPassword: function () {
        let _this = this
        putRequest('/users/password',{
          newPwd: this.forgotForm.password1,
          oldPwd: this.forgotForm.password,
        }).then(resp => {
          
        })

      },
      onLoginByPhone: function () {
        let _this = this
        postRequest('/login/sms',{
          phone: this.loginByPhoneForm.phone,
          code: this.loginByPhoneForm.smsCode
        }).then(resp => {
          if (resp.data.status == 200) {
            _this.$alert(resp.data.msg)
            _this.$store.commit('login', _this.loginForm) // 存储表单内容
            localStorage.setItem('access_token', resp.data.token)
            _this.$router.replace({path: '/home'});     // 跳转到首页

          }
        })
      },
      // 这里使用定义的数据
      onLogin: function () { // 提交表单
        let _this = this;
        this.loading = true;
        postRequest('/login/password', { // 被封装了的axios方法
          // 向服务器发送请求
          username: this.loginForm.username,
          password: this.loginForm.password
        }).then(resp => {
          _this.loading = false;
          if (resp.status == 200) { // 200 表示成功 300 表示重定向
            //成功
            let json = resp.data;
            console.log(json)
            if (json.status == 200) { // 返回成功便跳转到home
              _this.$store.commit('login', _this.loginForm) // 存储表单内容
              _this.$router.replace({path: '/home'});     // 跳转到首页
              localStorage.setItem('access_token', json.data.token)
            } else if (json.status == 500) {
              _this.$alert( '用户名或密码错误！','登录失败！');
            }
          } else {
            //失败
            _this.$alert('登录失败!', '💩失败!');
          }
        }, resp => {
          console.log(resp.status);
          _this.loading = false;
          _this.$alert('哎呀！找不到服务器⊙﹏⊙||!', '💩真尴尬!');
        });
      },
      getMsgCode(phone) {
        let _this = this;
        this.loading = false;
        getRequest('/sms/' + phone,{
        }).then(resp => {
          if(resp.status == 200) {
            _this.$alert('验证码发送成功');
            _this.countDown(60)
          }
        })
      },
      randomNum (min, max) {
        return Math.floor(Math.random() * (max - min) + min)
      },
      refreshCode () {
        this.identifyCode = ''
        this.makeCode(this.identifyCodes, 4)
        this.verifyCode()
      },
      verifyCode () {
        if(this.loginForm.smsCode == this.identifyCode) {
          this.verify = true
        } else {
          this.verify = false
        }
      },
      makeCode (o, l) {
        for (let i = 0; i < l; i++) {
          this.identifyCode += this.identifyCodes[
              this.randomNum(0, this.identifyCodes.length)
              ]
        }
      },
      countDown (time) {
        if (time === 0) {
          this.disabledCodeBtn = true
          this.codeText = "获取"
          return
        } else {
          this.disabledCodeBtn = false;
          this.codeText = '重新发送(' + time + ')'
          time--
        }
        setTimeout(()=> {
          this.countDown(time)
        }, 1000)
      }
    },
    mounted() {
      this.refreshCode()
      this.getUniversity()
      this.getColleges(this.registerForm.schoolId)
    }
  }
</script>
<style>
#paper {
  background:url("../assets/backimg3.jpg") no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  background-size: cover;
  position: fixed;
  top: 0;
}
body {
  margin: 0;
}

.login-container {
    border-radius: 15px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background-color: rgba(255,255,255,0.9);
  }

  .login_title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }

  .login_remember {
    margin: 0px 0px 35px 0px;
    text-align: left;
  }
</style>
