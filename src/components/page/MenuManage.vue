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
        height="600px"
        :data="tableData"
        tooltip-effect="dark"
        highlight-current-row
        row-key="id"
        style="width: 100%;"
        :tree-props="{children: 'children'}"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          prop="id"
          label="菜单ID"
          width="150px"
      >
        <!--        <template slot-scope="scope">{{ scope.row.uid }}</template>-->
      </el-table-column>
      <el-table-column
          prop="name"
          label="菜单名"
      >
      </el-table-column>

      <el-table-column
          prop="icon"
          label="图标"
      >
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column
          prop="path"
          label="路径"
      >
      </el-table-column>
      <el-table-column
          prop="component"
          label="组件"
      >
      </el-table-column>
      <el-table-column
          prop="hidden"
          label="隐藏"
          show-overflow-tooltip>
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.hidden"
              active-color="#ff4949"
              inactive-color="#13ce66">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm
              class="buttons"
              @confirm="handleForbidden(scope.$index, scope.row)"
              title="确定禁用该菜单？"
          >
            <el-button
                size="mini"
                slot="reference"
            >{{scope.row.enable ? '禁用' : '解禁'}}</el-button>
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
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="MenuForm">
        <el-form-item label="用户名" label-width="120px">
          <el-input v-model="MenuForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" label-width="120px">
          <el-input v-model="MenuForm.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" label-width="120px">
          <el-input v-model="MenuForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色" label-width="120px" style="float: left">
          <el-select v-model.number="MenuForm.roleId" placeholder="请选择用户角色">
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
  name: "MenuManage",
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
      MenuForm: {
        username: '',
        email: '',
        phone: '',
        roleId: 2
      }
    }
  },
  methods: {
    getMenus() {
      let _this = this
      _this.loading = true
      getRequest('/menus/role/' + 1).then(resp => {
        _this.tableData = resp.data.data
        _this.total = resp.data.data.total
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
          _this.getMenus()
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
      this.getMenus()
    }
  },
  created() {
    this.getMenus()
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

