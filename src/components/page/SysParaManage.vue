<template>
  <div class="base-table">
    <div style="margin-top: 20px;display: flex;margin-bottom: 20px">
      <div class="buttons">
        <el-button @click="toggleSelection()" type="warning">取消选择</el-button>
      </div>
      <div class="buttons">
        <el-button @click="deleteSelected()" type="danger">批量删除</el-button>
      </div>
      <div class="buttons">
        <el-button @click="addItem" type="primary">添加参数</el-button>
      </div>
      <div style="margin-left: 20px">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="参数名" value="1"></el-option>
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
          label="ID"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="name"
          label="名称"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="key"
          label="键"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="value"
          label="值"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="remark"
          label="参数描述"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              size="mini"
              @click="dialogFormVisibleForEdit = true;SysParamForm.id = scope.row.id;SysParamForm.key = scope.row.key">编辑</el-button>
          <el-popconfirm
              style="margin-left: 5px"
            title="确定要删除此项？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button
                slot="reference"
                size="mini"
                type="danger">删除</el-button>
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
          layout="prev, pager, next, jumper"
          :total="tableData.length">
      </el-pagination>
    </div>

    <!-- 添加参数-->
    <el-dialog title="添加系统参数" :visible.sync="dialogFormVisibleForAdd" width="700px">
      <el-form :model="SysParamForm" :rules="rules" ref="form">
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="SysParamForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="键" :label-width="formLabelWidth" prop="key">
          <el-input v-model="SysParamForm.key" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth" prop="value">
          <el-input v-model="SysParamForm.value" autocomplete="off"></el-input>
        </el-form-item>
<!--        <el-form-item label="创建者" :label-width="formLabelWidth">-->
<!--          <el-input v-model="SysParamForm.creator" autocomplete="off"></el-input>-->
<!--        </el-form-item>-->
        <el-form-item label="描述" :label-width="formLabelWidth" prop="remark">
          <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="SysParamForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleForAdd = false">取 消</el-button>
        <el-button type="primary" @click="addSysParam">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑参数-->
    <el-dialog title="编辑系统参数" :visible.sync="dialogFormVisibleForEdit" width="700px">
      <el-form :model="SysParamForm" :rules="rules" ref="formforedit">
        <el-form-item label="ID" :label-width="formLabelWidth" prop="id">
          <el-input v-model="SysParamForm.id" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="SysParamForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="键" :label-width="formLabelWidth">
          <el-input v-model="SysParamForm.key" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth" prop="value">
          <el-input v-model="SysParamForm.value" autocomplete="off"></el-input>
        </el-form-item>
        <!--        <el-form-item label="创建者" :label-width="formLabelWidth">-->
        <!--          <el-input v-model="SysParamForm.creator" autocomplete="off"></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item label="描述" :label-width="formLabelWidth" prop="remark">
          <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="SysParamForm.remark">
          </el-input>
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
  name: "SysParaManage",
  data() {
    // 自定义关键字验证
    let checkKey = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('关键字不能为空'));
      } else {
        let ok = true
        for(let item of this.tableData) {
          if (item.key == value) {
            ok = false
          }
        }
        if (ok) {
          callback();
        } else {
          return callback(new Error('关键字重复'))
        }
      }
    };
    return {
      pageSize: 9,
      currentPage: 1,
      select: '参数名',
      tableData: [],
      multipleSelection: [],
      search: '',
      formLabelWidth: '120px',
      dialogFormVisibleForAdd: false,
      dialogFormVisibleForEdit: false,
      SysParamForm: {
        id: 0,
        name: '',
        key: '',
        value: '',
        creator: 0,
        remark: ''
      },
      rules: {
        name: [
          {required: true, message: '请输入变量名称', trigger: 'blur'},
        ],
        key: [
          {validator: checkKey, required: true},
        ],
        value: [
          {required: true, message: '请输入值', trigger: 'blur'},
        ]
      }
    }
  },
  methods: {
    addSysParam() {
      let _this = this
      _this.SysParamForm.creator = window.localStorage.getItem('user').id
      this.$refs.form.validate(valid => {
        if(valid) {
          postRequest('/system-profiles',_this.SysParamForm).then(resp => {
            _this.$message(resp.data.msg)
            if(resp.data.status == 200) {
              _this.getSysParams()
            }
          });
          _this.dialogFormVisibleForAdd = false
        } else {
          _this.$message({
            showClose: true,
            message: '名称、关键字和值为必填项！',
            type: 'error'
          })
        }
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
    getSysParams() {
      let _this = this
      getRequest('/system-profiles', {
        pageNum: 1,
        pageSize: 10
      }).then(resp => {
        _this.tableData = resp.data.data.list
        console.log('shujuzidian',resp.data.data)
      })
    },
    deleteSelected() {
      let _this = this
      const selected = this.multipleSelection
      let count = 0
      for(let item of selected) {
        deleteRequest('/system-profiles/' + item.id).then(resp => {
          if(resp.data.status == 200) {
            count++
          }
          _this.$message(resp.data.msg)
          _this.getSysParams()
        })
      }
    },
    addItem () {
      this.dialogFormVisibleForAdd = true
    },
    handleEdit(index, row){
      let _this = this
      putRequest('/dict/data', this.SysParamForm).then(resp => {
        _this.$message(resp.data.msg)
      })
    },
    handleDelete(index, row){
      let _this = this
      deleteRequest('/system-profiles/' + row.id).then(resp => {
        _this.$message(resp.data.msg)
        _this.getSysParams()
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
    }
  },
  mounted() {
    this.getSysParams()
    this.SysParamForm.creator = window.localStorage.getItem('user_id')
  }
}
</script>

<style scoped>
.base-table {
  position: relative;
  padding: 10px;
  padding-bottom: 10px;
  height: 100%;
  top: 10px;
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
