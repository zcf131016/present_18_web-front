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
          prop="title"
          label="显示名称"
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
              @change="changeStatus(scope.row)"
              active-color="#ff4949"
              inactive-color="#13ce66">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-popconfirm
              class="buttons"
              @confirm="MenuForm = scope.row;dialogFormVisibleForEdit=true"
              title="确定编辑该菜单？"
          >
            <el-button
                size="mini"
                slot="reference"
            >编辑</el-button>
          </el-popconfirm>
          <el-popconfirm
              class="buttons"
              @confirm="handleDelete(scope.$index, scope.row)"
              confirmButtonText='好的'
              cancelButtonText='不用了'
              icon="el-icon-info"
              iconColor="red"
              title="确定删除该菜单？"
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
<!--      <el-pagination-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page.sync="currentPage"-->
<!--          :page-size="pageSize"-->
<!--          layout="total, prev, pager, next, jumper"-->
<!--          :total="this.total">-->
<!--      </el-pagination>-->
    </div>
    <el-dialog title="添加菜单" :visible.sync="dialogFormVisible">
      <el-form :model="MenuForm">
        <el-form-item label="菜单名" label-width="120px">
          <el-input v-model="MenuForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" label-width="120px">
          <el-input v-model="MenuForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父菜单ID" label-width="120px">
          <el-input v-model="MenuForm.parentId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" label-width="120px">
          <template>
            <icon-picker v-model="MenuForm.icon"></icon-picker>
          </template>
        </el-form-item>
        <el-form-item label="路径" label-width="120px">
          <el-input v-model="MenuForm.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="组件" label-width="120px" style="float: left">
          <el-input v-model="MenuForm.component" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addMenu">确 定</el-button>
      </div>
    </el-dialog>
<!--    编辑菜单-->
    <el-dialog title="编辑菜单" :visible.sync="dialogFormVisibleForEdit">
      <el-form :model="MenuForm">
        <el-form-item label="菜单名" label-width="120px">
          <el-input v-model="MenuForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="显示名称" label-width="120px">
          <el-input v-model="MenuForm.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父菜单ID" label-width="120px">
          <el-input v-model="MenuForm.parentId" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标" label-width="120px">
          <template>
            <icon-picker v-model="MenuForm.icon"></icon-picker>
          </template>
        </el-form-item>
        <el-form-item label="路径" label-width="120px">
          <el-input v-model="MenuForm.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="组件" label-width="120px" style="float: left">
          <el-input v-model="MenuForm.component" autocomplete="off"></el-input>
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
      dialogFormVisibleForEdit: false,
      search: '',
      MenuForm: {
        component: "",
        hidden: true,
        icon: "",
        id: 0,
        name: "",
        parentId: 0,
        path: "",
        title: ""
      }
    }
  },
  methods: {
    addMenu(){
      let _this = this
      postRequest('/menus', {
        component: _this.MenuForm.component,
        icon: _this.MenuForm.icon,
        name: _this.MenuForm.name,
        parentId: _this.MenuForm.parentId,
        path: _this.MenuForm.path,
        title: _this.MenuForm.title
      }).then(resp => {
        _this.$message({
          type: 'success',
          message: resp.data.msg
        })
        _this.getMenus()
      })
    },
    changeStatus(row) {
      let _this = this
      putRequest('/menus',{
        id: row.id,
        hidden: row.hidden
      }).then(resp => {
        _this.$message({
          type: 'success',
          message: resp.data.msg
        })
      })
    },
    getMenus() {
      let _this = this
      _this.loading = true
      getRequest('/menus/').then(resp => {
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
    handleEdit(index, row) {
      let _this = this
      putRequest('/menus', {
        id: _this.MenuForm.id,
        name: _this.MenuForm.name,
        path: _this.MenuForm.path,
        component: _this.MenuForm.component,
        parentId: _this.MenuForm.parentId,
        icon: _this.MenuForm.icon,
        title: _this.MenuForm.title
      }).then(resp => {
        _this.$message({
          type: 'success',
          message: resp.data.msg
        })
      })
    },
    handleDelete(index, row){
      let _this = this
      deleteRequest('/menus/' + row.id, {}).then(resp => {
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

