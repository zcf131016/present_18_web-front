<template>
  <div class="base-table">
    <div style="margin-top: 20px;display: flex;margin-bottom: 20px">
      <div class="buttons">
        <el-button @click="toggleSelection()" type="warning">取消选择</el-button>
      </div>
      <div class="buttons">
        <el-popconfirm
            title="确定删除这些条目吗？"
        >
          <el-button slot="reference" @click="deleteSelected()" type="danger">批量删除</el-button>
        </el-popconfirm>
      </div>
      <div class="buttons">
        <el-button @click="dialogFormVisible = true" type="primary">添加</el-button>
      </div>
      <div style="margin-left: 20px">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="用户ID" value="1"></el-option>
            <el-option label="用户名" value="2"></el-option>
            <el-option label="用户电话" value="3"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <el-divider></el-divider>
    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
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
      </el-table-column>
      <el-table-column
          prop="enable"
          label="状态"
          show-overflow-tooltip>
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
          <el-button
              size="mini"
              @click="handleForbidden(scope.$index, scope.row)">{{scope.row.enable ? '禁用' : '解禁'}}</el-button>
          <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
            <el-option label="管理员" value="1"></el-option>
            <el-option label="教师" value="2"></el-option>
            <el-option label="学生" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deleteRequest, getRequest} from "@/utils/api";

export default {
  name: "UsersManage",
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      select: '学号',
      tableData: [],
      total: 0,
      multipleSelection: [],
      dialogFormVisible: false,
      search: '',
      UserForm: {
        username: '',
        email: '',
        phone: '',
        roleId: 2
      }
    }
  },
  methods: {
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
          _this.tableData[i].enable = _this.tableData[i] ? '可用' : '禁用'
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

    },
    addUser () {
      // 添加用户
      this.dialogFormVisible = false
      let _this = this
    },
    handleForbidden(index, row) {

    },
    handleDelete(index, row){
      let _this = this
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
  margin-left: 20px;
}
</style>

