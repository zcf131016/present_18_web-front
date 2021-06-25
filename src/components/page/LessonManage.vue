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
            <el-option label="班课号" :value="1"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
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
          width="80px"
      >
<!--                <template slot-scope="scope">{{ scope.row.uid }}</template>-->
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
          prop="teacherId"
          label="任课教师"
      >
      </el-table-column>
      <el-table-column
          prop="isAllow"
          label="允许加入"
      >
        <template slot-scope="scope">
          <el-switch
              v-model="scope.row.isAllow"
              @change="handleForbidden(scope.$index, scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作"  fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button
              size="mini"
              type="warning"
              @click="dialogFormVisibleForEdit = true;ClassForm.name=scope.row.name;ClassForm.semester=scope.row.semester;ClassForm.classroom=scope.row.classroom;ClassForm.id=scope.row.id">编辑班课</el-button>
          <el-button
              size="mini"
              type="success"
              @click="getMembers(scope.$index, scope.row)">班课成员</el-button>
          <el-popconfirm
              class="buttons"
            title="确定删除此班课？"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button
                size="mini"
                slot="reference"
                type="danger">删除班课</el-button>
          </el-popconfirm>

        </template>
      </el-table-column>
    </el-table>
<!--    班课成员信息-->
    <el-drawer
        title="班课成员"
        :visible.sync="showMembers"
        direction="rtl"
        size="50%">
      <el-table :data="MembersData" style="margin: 20px;margin-right: 20px" max-height="800px">
        <el-table-column property="id" label="ID" width="50px"></el-table-column>
        <el-table-column property="username" label="姓名" width="150px"></el-table-column>
        <el-table-column property="experiment" label="经验值" max-width="200px"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="success"
                @click="handleModify(scope.$index, scope.row)">修改经验值</el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleOut(scope.$index, scope.row)">移出班课</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-drawer>
<!--    班课成员信息结束-->
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
<!--    添加班课-->
    <el-dialog title="添加班课" :visible.sync="dialogFormVisible">
      <el-form :model="ClassForm">
        <el-form-item label="班课名" label-width="120px">
          <el-input v-model="ClassForm.name" autocomplete="off"></el-input>
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
<!--    编辑班课信息-->
    <el-dialog title="编辑班课信息" :visible.sync="dialogFormVisibleForEdit">
      <el-form :model="ClassForm">
        <el-form-item label="班课名" label-width="120px">
          <el-input v-model="ClassForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="教室" label-width="120px">
          <el-input v-model="ClassForm.classroom" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="学期" label-width="120px">
          <el-input v-model="ClassForm.semester" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleForEdit = false">取 消</el-button>
        <el-button type="primary" @click="editCourses">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";

export default {
  name: "LessonManage",
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      select: 1,
      tableData: [],
      MembersData: [],
      total: 0,
      multipleSelection: [],
      dialogFormVisible: false,
      dialogFormVisibleForEdit: false,
      showMembers: false,
      search: '',
      ClassForm: {
        id: 0,
        name: '',
        semester: '',
        classroom: '',
        teacherId: 0
      },
      student: {
        username: '',

      }
    }
  },
  methods: {
    handleSearch() {
      let _this = this
      getRequest('/courses/number/' + _this.search, {}).then(resp => {
        _this.$message({
          type: 'success',
          message: "查询成功"
        })
        _this.tableData = []
        _this.tableData.push(resp.data.data)
      })
    },
    editCourses() {
      let _this = this
      putRequest('courses', {
        id: _this.ClassForm.id,
        name: _this.ClassForm.name,
        semester: _this.ClassForm.semester,
        classroom: _this.ClassForm.classroom
      }).then(resp => {
        _this.$message({
          type: 'normal',
          message: resp.data.msg
        })
        this.getAllCourses()
      })
    },
    getAllCourses() {
      let _this = this
      getRequest('/courses',{
        pageNum: _this.currentPage,
        pageSize: _this.pageSize
      }).then(resp => {
        _this.tableData = resp.data.data
        for(let i = 0;i < _this.tableData.length;i++) {
          getRequest('/users/' + _this.tableData[i].teacherId, {}).then(resp => {
            _this.tableData[i].teacherId = resp.data.data.nickname
          })
        }
      })
    },
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
    handleOut (index, row) {

    },
    handleModify (index, row) {

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
          _this.getAllCourses()
        }
      })
    },
    handleForbidden(index, row) {
      let _this = this
      putRequest('/courses',{
        id: row.id,
        isAllow: row.isAllow
      }).then(resp => {
        _this.$message({
          type: 'success',
          message: resp.data.msg
        })
      })
    },
    handleMember(index, row) {

    },
    handleDelete(index, row){
      let _this = this
      deleteRequest('/courses/' + row.id, {}).then(resp => {
        if(resp.data.status == 200) {
          _this.$message(resp.data.msg)
          _this.getAllCourses()
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
    },
    getMembers (index, row) {
      let _this = this
      getRequest('/courses/members/' + row.id, {
      }).then(resp => {
          _this.MembersData = resp.data.data
          _this.showMembers = true
          // console.log('members', _this.MembersData)
      })
    }
  },
  mounted() {
    this.getCourses()
    this.getAllCourses()
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
  margin-left: 10px;
}
</style>

