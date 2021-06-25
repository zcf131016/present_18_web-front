<template>
  <div class="base-table">
    <div style="width: 100%;height: 60px;padding: 0px;padding-left: 0;margin-top: 0;background: #FAFAFA;display: flex;margin-bottom: 20px;position: fixed;z-index: 2">
      <div class="buttons">
        <el-button @click="toggleSelection()" type="warning">取消选择</el-button>
      </div>
      <div class="buttons">
        <el-popconfirm
            title="确定删除这些条目吗？"
            @confirm="deleteSelected()"
        >
          <el-button slot="reference" type="danger">批量删除</el-button>
        </el-popconfirm>
      </div>
      <div class="buttons">
        <el-button @click="dialogFormVisible = true" type="primary">添加</el-button>
      </div>
      <div style="margin-left: 20px">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="所有用户" :value="0"></el-option>
            <el-option label="用户名" :value="1"></el-option>
            <el-option label="用户角色ID" :value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
        </el-input>
      </div>
    </div>
    <el-divide></el-divide>
    <el-table
        ref="multipleTable"
        max-height="800px"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;margin-top: 80px"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="id"
          label="用户ID"
          width="80px"
      >
<!--        <template slot-scope="scope">{{ scope.row.uid }}</template>-->
      </el-table-column>
      <el-table-column
          prop="username"
          label="用户名"
      >
      </el-table-column>
      <el-table-column
          prop="email"
          label="邮箱"
      >
      </el-table-column>
      <el-table-column
          prop="phone"
          label="手机号"
      >
      </el-table-column>
      <el-table-column
          prop="roleId"
          label="角色"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.roleId == '管理员' ? 'warning' : 'info'"
            v-model="scope.row.roleId"
          >
            {{scope.row.roleId}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
          prop="enable"
          label="状态"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <el-switch
              @change="handleForbidden(scope.$index, scope.row)"
              v-model="scope.row.enable"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
          prop="lastLoginTime"
          label="最近登录"
      >
      </el-table-column>
      <el-table-column
          prop="createTime"
          label="创建时间"
      >
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm
              class="buttons"
            @confirm="prepare(scope.row)"
            title="确定要修改用户信息？"
          >
            <el-button
                size="mini"
                type="warning"
                slot="reference"
                plain
                >编辑</el-button>
          </el-popconfirm>
          <el-popconfirm
              class="buttons"
              @confirm="handleDelete(scope.$index, scope.row)"
              confirmButtonText='好的'
              cancelButtonText='不用了'
              icon="el-icon-info"
              iconColor="red"
              title="确定删除该用户？"
          >
            <el-button
                size="mini"
                type="danger"
                slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next, jumper"
          :total="this.total">
      </el-pagination>
    </div>
<!--    添加用户-->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="UserForm">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="UserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="UserForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="UserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="120px" style="float: left">
          <el-select v-model.number="UserForm.roleId" placeholder="请选择用户角色">
            <el-option label="管理员" :value="1"></el-option>
            <el-option label="教师" :value="2"></el-option>
            <el-option label="学生" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>

    <!--    编辑用户-->
    <el-dialog title="编辑用户信息" :visible.sync="dialogFormVisibleForEdit">
      <el-form :model="UserForm" :rules="rules">
        <el-form-item label="用户名" label-width="120px" prop="name">
          <el-input v-model="UserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="120px">
          <el-input v-model="UserForm.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px" prop="phone">
          <el-input v-model="UserForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px" prop="email">
          <el-input v-model="UserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="120px" style="float: left">
          <el-select v-model.number="UserForm.roleId" placeholder="请选择用户角色">
            <el-option label="管理员" :value="1"></el-option>
            <el-option label="教师" :value="2"></el-option>
            <el-option label="学生" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleForEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";

export default {
  name: "UsersManage",
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      select: 0,
      tableData: [],
      total: 0,
      multipleSelection: [],
      currentUser: {},
      dialogFormVisible: false,
      dialogFormVisibleForEdit: false,
      search: '',
      UserForm: {
        id: 0,
        username: '',
        email: '',
        phone: '',
        nickname: '',
        roleId: 1
      },
      rules: {
        name: [{required: true, message: '请输入用户名', trigger: 'blur'}],
        phone: [{required: true, message: '请输入手机号', trigger: 'blur'}],
        email: [{required: true, message: '请输入用户邮箱', trigger: 'blur'}]
      }
    }
  },
  methods: {
    handleSearch() {
      let _this = this
      if(this.select == 1) {
        getRequest('/users/username/' + this.search, {
          pageNum: _this.currentPage,
          pageSize: _this.pageSize
        }).then(resp => {
          _this.tableData = resp.data.data.list
          _this.total = resp.data.data.total
          for(let i = 0;i < _this.tableData.length;i++) {
            _this.tableData[i].phone = _this.tableData[i].phone == null ? '未绑定' : _this.tableData[i].phone
            _this.tableData[i].email = _this.tableData[i].email == null ? '未绑定' : _this.tableData[i].email
            _this.tableData[i].lastLoginTime = _this.tableData[i].lastLoginTime == null ? '无登录记录' : _this.tableData[i].lastLoginTime
            let role_id = _this.tableData[i].roleId
            switch (role_id) {
              case 1:
                _this.tableData[i].roleId = '管理员'
                break
              case 2:
                _this.tableData[i].roleId = '教师'
                break
              case 3:
                _this.tableData[i].roleId = '学生'
                break
            }
          }
          console.log('hello', resp.data.data)
        })
      } else if(this.select == 2) {
        getRequest('/users/role/' + this.search, {
          pageNum: _this.currentPage,
          pageSize: _this.pageSize
        }).then(resp => {
          _this.tableData = resp.data.data.list
          _this.total = resp.data.data.total
          for(let i = 0;i < _this.tableData.length;i++) {
            _this.tableData[i].phone = _this.tableData[i].phone == null ? '未绑定' : _this.tableData[i].phone
            _this.tableData[i].email = _this.tableData[i].email == null ? '未绑定' : _this.tableData[i].email
            _this.tableData[i].lastLoginTime = _this.tableData[i].lastLoginTime == null ? '无登录记录' : _this.tableData[i].lastLoginTime
            let role_id = _this.tableData[i].roleId
            switch (role_id) {
              case 1:
                _this.tableData[i].roleId = '管理员'
                break
              case 2:
                _this.tableData[i].roleId = '教师'
                break
              case 3:
                _this.tableData[i].roleId = '学生'
                break
            }
          }
          console.log('hello', resp.data.data)
        })
      } else {
        _this.getUsers()
      }
    },
    prepare(row) {
      this.UserForm.id = row.id
      this.UserForm.username = row.username
      this.UserForm.email = row.email
      this.UserForm.phone = row.phone
      let roleId = 1
      switch (row.roleId) {
        case '管理员':
          roleId = 1
          break
        case '教师':
          roleId=2
          break
        case '学生':
          roleId=3
          break
      }
      this.UserForm.roleId = roleId
      this.dialogFormVisibleForEdit = true
      console.log(this.UserForm)
    },
    handleEdit() {
      let _this = this
      putRequest('/users',_this.UserForm).then(resp => {
        _this.$message({
          type: 'success',
          message: resp.data.msg
        })
      })
      this.getUsers();
    },
    getUsers() {
      let _this = this
      _this.loading = true
      getRequest('/users',{
        pageNum: _this.currentPage,
        pageSize: _this.pageSize
      }).then(resp => {
        _this.tableData = resp.data.data.list
        _this.total = resp.data.data.total
        for(let i = 0;i < _this.tableData.length;i++) {
          _this.tableData[i].phone = _this.tableData[i].phone == null ? '未绑定' : _this.tableData[i].phone
          _this.tableData[i].email = _this.tableData[i].email == null ? '未绑定' : _this.tableData[i].email
          _this.tableData[i].lastLoginTime = _this.tableData[i].lastLoginTime == null ? '无登录记录' : _this.tableData[i].lastLoginTime
          let role_id = _this.tableData[i].roleId
          switch (role_id) {
            case 1:
              _this.tableData[i].roleId = '管理员'
              break
            case 2:
              _this.tableData[i].roleId = '教师'
              break
            case 3:
              _this.tableData[i].roleId = '学生'
              break
          }
        }
        console.log('hello', resp.data.data)
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    deleteSelected() {
      let selected = this.$refs.multipleTable.selection;
      console.log(selected)
      selected.forEach(row => {
        deleteRequest("/users/" + row.id, {}).then(resp => {
          this.$message({
            type: 'success',
            message: resp.data.msg
          })
        })
      })
      this.getUsers();
    },
    addUser () {
      // 添加用户
      this.dialogFormVisible = false
      let _this = this
      postRequest('/users/admin', {
        username: this.UserForm.username,
        phone: this.UserForm.phone,
        email: this.UserForm.email,
        roleId: this.UserForm.roleId
      }).then(resp => {
        _this.$message({
          type: "success",
          message: resp.data.msg
        })
      })
    },
    handleForbidden(index, row) {
      let _this = this
      putRequest('/users/enable/' + row.id,{}).then(resp => {
        _this.$message(resp.data.msg)
        _this.getUsers()
      })
    },
    handleDelete(index, row){
      let _this = this
      console.log('准备删除')
      deleteRequest('/users/' + row.id, {}).then(resp => {
        if(resp.data.status == 200) {
          _this.$message(resp.data.msg)
          _this.getUsers()
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val
      this.getUsers()
    }
  },
  mounted() {
    this.getUsers()
  }
}
</script>

<style scoped>
.base-table {
  position: relative;
  padding: 10px;
  padding-bottom: 10px;
  height: 100%;
  /*top: 10px;*/
}
.block {
  float: right;
  margin-top: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.buttons {
  margin-left: 10px;
}
</style>

