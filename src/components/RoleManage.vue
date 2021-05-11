<template>
  <div>
    <!--工具栏-->
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
        <el-button @click="addItem" type="primary">添加</el-button>
      </div>
      <div style="margin-left: 20px">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="学号" value="1"></el-option>
            <el-option label="姓名" value="2"></el-option>
            <el-option label="用户电话" value="3"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <el-divider></el-divider>
  <el-row :gutter="15">
    <!--角色管理-->
    <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17" style="margin-bottom: 10px">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <span class="role-span">角色列表</span>
        </div>
        <el-table
            ref="multipleTable"
            highlight-current-row
            @current-change="getRoleMenu"
            style="width: 100%;"
            :data="TableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="id" label="ID" />
          <el-table-column prop="name" label="名称" />
          <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述" />
          <el-table-column :show-overflow-tooltip="true" width="135px" prop="create_time" label="创建日期" />
          <el-table-column label="操作" width="200px" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button
                  size="mini"
                  class="op-button"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.$index, scope.row)"></el-button>
              <el-popconfirm
                title="确定删除这个条目吗？"
              >
                <el-button
                    class="op-button"
                    slot="reference"
                    size="mini"
                    icon="el-icon-delete"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"></el-button>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <!--分页组件-->
        <div class="block">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="TableData.length">
          </el-pagination>
        </div>
      </el-card>
    </el-col>
    <!-- 菜单授权 -->
    <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
      <el-card class="box-card" shadow="never">
        <div slot="header" class="clearfix">
          <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
            <span class="role-span">菜单分配</span>
          </el-tooltip>
          <el-button
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu"
          >保存</el-button>
        </div>
        <el-tree
            :data="menus"
            ref="menuTree"
            show-checkbox
            check-strictly
            highlight-current
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="this.AssignedMenu"
            :props="defaultProps">
        </el-tree>
      </el-card>
    </el-col>
  </el-row>
    <!-- 编辑角色-->
    <el-dialog title="编辑角色" :visible.sync="dialogFormVisible" width="700px">
      <el-form :model="RoleForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="RoleForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-row :gutter="24">
          <el-col :span="10">
            <el-form-item label="角色级别" prop="level" :label-width="formLabelWidth">
              <el-input-number v-model.number="RoleForm.level" :min="1" controls-position="right" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="数据范围" prop="dataScope" :label-width="formLabelWidth">
              <el-select v-model="RoleForm.dataScope" placeholder="请选择数据范围">
                <el-option
                    v-for="item in dateScopes"
                    :key="item"
                    :label="item"
                    :value="item"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="RoleForm.description">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getRequest, postRequest} from "@/utils/api";

export default {
  name: "RoleManage",
  data() {
    return {
      pageSize: 9,
      currentPage: 1,
      multipleSelection: [],
      AssignedMenu: [],
      query: '',
      select: '',
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入权限', trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dateScopes: [
          '全部',
          '本级',
          '自定义'
      ],
      RoleForm: {
        name: '',
        dataScope: '',
        level: '',
        description: '-'
      },
      TableData: [],
      menus: [],
      currentId: 0, menuLoading: false, showButton: true,
      defaultProps: { children: 'children', label: 'title', isLeaf: 'leaf' },
      menuIds: [], depts: [], deptDatas: [], // 多选时使用
    }
  },
  methods: {
    getRoleMenu(val) {
      let _this = this
      _this.loading = true
      this.AssignedMenu = []
      getRequest('/menus/role/' + val.id, {}).then(resp => {
        let menus = resp.data.data
        for (let i = 0;i < menus.length;i++) {

          _this.AssignedMenu.push(menus[i].id)
          for(let j = 0;j < menus[i].children.length;j++){
            _this.AssignedMenu.push(menus[i].children[j].id)
          }
        }
        _this.$refs.menuTree.setCheckedKeys([])
        _this.$refs.menuTree.setCheckedKeys(_this.AssignedMenu)
        _this.loading = false
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
    getAllRole: function () {
      let _this = this
      getRequest('/roles',{
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(resp => {
        if (resp.data.status == 200) {
          _this.TableData = resp.data.data
        } else {
          _this.$message(resp.data.msg)
        }
      })
    },
    deleteSelected() {
    },
    addItem () {
    },
    menuChange() {},
    saveMenu() {
      let selectedMenu = this.$refs.menuTree.getHalfCheckedKeys().concat(this.$refs.menuTree.getCheckedKeys())
      console.log('当前菜单',selectedMenu)
      // 提交菜单分配
      postRequest('',{}).then(resp => {

      })
    },
    getMenu: function () {
      this.menus = this.$store.state.menus
    },
    handleEdit: function (index, row){
      this.dialogFormVisible = true
      this.RoleForm.name = row.name
    },
    handleDelete: function (){},
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    }
  },
  mounted() {
  },
  created() {
    this.getAllRole()
    this.getMenu()
  }
}
</script>

<style scoped>
.buttons {
  margin-left: 20px;
}
.block {
  float: right;
  margin-top: 30px;
  margin-right: 30px;
  margin-bottom: 30px;
}
.op-button {
  margin-left: 5px;
}
</style>
