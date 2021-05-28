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
          label="班课ID"
          width="50px"
      >
        <!--        <template slot-scope="scope">{{ scope.row.uid }}</template>-->
      </el-table-column>
      <el-table-column
          prop="name"
          label="班课名"
      >
      </el-table-column>
      <el-table-column
          prop="number"
          label="班课号"
      >
      </el-table-column>
      <el-table-column
          prop="classroom"
          label="教室"
      >
      </el-table-column>
      <el-table-column
          prop="semester"
          label="学期"
      >
      </el-table-column>

      <el-table-column
          prop="teacherName"
          label="任课教师"
      >
      </el-table-column>
      <el-table-column
          prop="isAllow"
          label="允许加入"
      >
      </el-table-column>

      <el-table-column label="操作"  fixed="right" width="200px">
        <template slot-scope="scope">
          <el-button
              size="mini"
              :type="scope.row.isAllow ? 'success' : 'warning'"
              @click="handleForbidden(scope.$index, scope.row)">{{scope.row.isAllow ? '允许加入' : '禁止加入'}}</el-button>
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
    <el-dialog title="添加班课" :visible.sync="dialogFormVisible">
      <el-form :model="ClassForm">
        <el-form-item label="班课名" label-width="120px">
          <el-input v-model="ClassForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="班课号" label-width="120px">
          <el-input v-model="ClassForm.number" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="教室" label-width="120px">
          <el-input v-model="ClassForm.classroom" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学期" label-width="120px">
          <el-input v-model="ClassForm.semester" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCourses">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest} from "@/utils/api";

export default {
  name: "LessonManage",
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
      ClassForm: {
        name: '',
        number: '',
        isAllow: true,
        semester: '',
        classroom: '',
        teacher_id: ''
      }
    }
  },
  methods: {
    getCourses() {
      let _this = this
      _this.loading = true
      getRequest('/courses/type/' + '1',{
        pageNum: _this.currentPage,
        pageSize: _this.pageSize
      }).then(resp => {
        _this.tableData = resp.data.data
        console.log('courses', resp.data.data)
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
    addCourses () {
      // 创建班课
      this.dialogFormVisible = false
      let _this = this
      postRequest('/courses',{
        classroom: _this.ClassForm.classroom,
        name: _this.ClassForm.name,
        semester: _this.ClassForm.semester
      }).then(resp => {
        if(resp.data.status == 200) {
          this.$message(resp.data.msg)
          _this.getCourses()
        }
      })
    },
    handleForbidden(index, row) {

    },
    handleDelete(index, row){
      let _this = this
      deleteRequest('/courses/' + row.id, {}).then(resp => {
        if(resp.data.status == 200) {
          _this.$message(resp.data.msg)
          _this.getCourses()
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
      this.getCourses()
    }
  },
  mounted() {
    this.getCourses()
  }
}
</script>

<style scoped>
.base-table {
  position: relative;
  padding: 10px;
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

