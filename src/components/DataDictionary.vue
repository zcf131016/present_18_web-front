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
        <el-button @click="addItem" type="primary">添加</el-button>
      </div>
      <div style="margin-left: 20px">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="类型名称" value="1"></el-option>
            <el-option label="类型编码" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <el-divider></el-divider>
    <el-table
        ref="multipleTable"
        :data="tableData.slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
          prop="code"
          label="类型编码"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="name"
          label="类型名称"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="remark"
          label="类型描述"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
              type="primary"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
              type="success"
              size="mini"
              @click="handleDetail(scope.$index, scope.row)">详细</el-button>
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
          layout="prev, pager, next, jumper"
          :total="tableData.length">
      </el-pagination>
    </div>
    <el-dialog :title="this.currentType" :visible.sync="dialogTableVisible" width="65%">
      <el-card>
        <el-table
            ref="multipleTable"
            :data="tableDataDetail.slice((currentPage-1)*pageSize,currentPage*pageSize)"
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
              prop="code"
              label="类型编码"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="name"
              label="类型名称"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="value"
              label="值"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="remark"
              label="类型描述"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="enable"
              label="是否启用"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="sort"
              label="排序"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column
              prop="create_time"
              label="创建时间"
              show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-button
                  type="primary"
                  size="mini"
                  @click="handleDetailEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                  size="mini"
                  type="danger"
                  @click="handleDetailDelete(scope.$index, scope.row)">删除</el-button>
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
              :total="tableDataDetail.length">
          </el-pagination>
        </div>
      </el-card>
    </el-dialog>
    <el-dialog title="编辑类型" :visible.sync="dialogFormVisible">
      <el-form :model="DetailForm">
        <el-form-item label="类型名称" :label-width="formLabelWidth">
          <el-input v-model="DetailForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型编码" :label-width="formLabelWidth">
          <el-input v-model="DetailForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型描述" :label-width="formLabelWidth">
          <el-input v-model="DetailForm.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onSummitEdit">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="收货地址" :visible.sync="dialogEditFormVisible">
      <el-form :model="EditForm">
        <el-form-item label="类型名称" :label-width="formLabelWidth">
          <el-input v-model="EditForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型编码" :label-width="formLabelWidth">
          <el-input v-model="EditForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型描述" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="EditForm.desc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogEditFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {getRequest, postRequest} from "@/utils/api";

export default {
  name: "DataDictionary",
  data() {
    return {
      dialogTableVisible: false,
      dialogFormVisible: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      pageSize: 9,
      currentPage: 1,
      select: '类型名',
      currentType: '',
      EditForm: {
        name: '',
        code: '',
        desc: ''
      },
      DetailForm: {
        name: '',
        code: '',
        desc: ''
      },
      tableData: [],
      tableDataDetail: [],
      multipleSelection: [],
      search: ''
    }
  },
  methods: {
    getDictionary: function () {
      let _this = this
      getRequest('/dict',{
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(resp => {
        if (resp.data.status == 200) {
          this.tableData = resp.data.data
        } else {
          _this.$alert(resp.data.msg)
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
    deleteSelected() {

    },
    addItem () {

    },
    handleEdit(index, row){
      this.dialogEditFormVisible = true
    },
    handleDelete(index, row){

    },
    handleDetail(index, row){
      let _this = this
      this.dialogTableVisible = true
      this.currentType = row.name
      getRequest('/dict/' + row.code + '/detail', {

      }).then(resp => {
        if (resp.data.status == 200) {
          this.tableDataDetail = resp.data.data
        } else {
          _this.$alert(resp.data.msg)
        }
      })
    },
    handleDetailEdit(index, row) {
      this.dialogFormVisible = true
      this.DetailForm.name = row.name
      this.DetailForm.code = row.code
      this.DetailForm.desc = row.desc
    },
    handleDetailDelete() {

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    onSummitEdit() {

    }
  },
  mounted() {
    this.getDictionary()
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
