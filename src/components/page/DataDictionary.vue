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
            @confirm="deleteSelected"
        >
          <el-button slot="reference" type="danger">批量删除</el-button>
        </el-popconfirm>
      </div>
      <div class="buttons">
        <el-button @click="dialogFormVisible = true" type="primary">添加字典</el-button>
      </div>
      <div style="margin-left: 20px">
        <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
          <el-select v-model="select" slot="prepend" placeholder="请选择">
            <el-option label="名称" value="1"></el-option>
            <el-option label="描述" value="2"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </div>
    </div>
    <el-divider></el-divider>
    <el-row :gutter="15">
      <!--数据字典管理-->
      <el-col :xs="24" :sm="24" :md="10" :lg="10" :xl="10" style="margin-bottom: 10px">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">字典列表</span>
          </div>
          <el-table
              ref="multipleTable"
              highlight-current-row
              @current-change="getDictDetail"
              style="width: 100%;"
              :data="TableData"
              @selection-change="handleSelectionChange"
              current-row-key="code"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="ID" />
            <el-table-column :show-overflow-tooltip="true" prop="name" label="名称" />

            <el-table-column :show-overflow-tooltip="true" prop="code" label="编码" />
            <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述" />
              <el-table-column property="enable" label="状态">
                <template slot-scope="scope">
                  <el-switch
                      on-text ="是"
                      off-text = "否"
                      on-color="#5B7BFA"
                      off-color="#dadde5"
                      v-model="scope.row.enable"
                      @change="changeDictStatus(scope.row)"
                  >
                  </el-switch>
                </template>
              </el-table-column>
            <el-table-column label="操作" width="200px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    class="op-button"
                    icon="el-icon-edit"
                    @click="dialogFormVisibleForDictEdit = true;DictForm.id = scope.row.id"></el-button>
                <el-popconfirm
                    title="确定删除这个条目吗？"
                    @confirm="handleDelete(scope.$index, scope.row)"
                >
                  <el-button
                      class="op-button"
                      slot="reference"
                      size="mini"
                      icon="el-icon-delete"
                      type="danger"
                      ></el-button>
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
      <!-- 字典详情表 -->
      <el-col :xs="24" :sm="24" :md="14" :lg="14" :xl="14">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="字典详情" placement="top">
              <span class="role-span">字典详情</span>
            </el-tooltip>
            <el-button
                :disabled="!showButton"
                :loading="menuLoading"
                icon="el-icon-check"
                size="mini"
                style="float: right; padding: 6px 9px"
                type="primary"
                @click="dialogFormVisibleForDetail = true"
            >添加数据</el-button>
            <el-button
                :disabled="!showButton"
                :loading="menuLoading"
                icon="el-icon-check"
                size="mini"
                style="float: right; padding: 6px 9px;margin-right:5px "
                type="success"
                @click="saveChange"
            >保存变更</el-button>
          </div>
          <el-table
              :data="DictDetail"
              row-key="id"
              @cell-mouse-enter.once="rowDrop"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="ID" hidden />
            <el-table-column prop="code" label="编码" />
            <el-table-column prop="value" label="值" />
            <el-table-column prop="name" label="名称" />
<!--            <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述" />-->
<!--            <el-table-column :show-overflow-tooltip="true" prop="enable" label="状态" />-->
            <el-table-column :show-overflow-tooltip="true" prop="sort" label="排序" />
            <el-table-column property="isDefault" label="默认">
              <template slot-scope="scope">
                <el-switch
                    on-color="#5B7BFA"
                    off-color="#dadde5"
                    v-model="scope.row.isDefault"
                    @change="changeDetailStatus(scope.row)"
                >
                </el-switch>
              </template>
            </el-table-column>
<!--            <el-table-column :show-overflow-tooltip="true" width="110px" prop="create_time" label="创建日期" />-->
            <el-table-column label="移动" width="200px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button-group>
                  <el-button  size="mini" icon="el-icon-arrow-up" @click="moveUp(scope.row,scope.$index)" plain></el-button>
                  <el-button  size="mini" @click="moveDown(scope.row,scope.$index)" plain><i class="el-icon-arrow-down"></i></el-button>
                </el-button-group>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px" align="center" fixed="right">
              <template slot-scope="scope">
                <el-button
                    size="mini"
                    class="op-button"
                    icon="el-icon-edit"
                    @click="dialogFormVisibleForDetailEdit = true;DictDetailForm.id = scope.row.id"></el-button>
                <el-popconfirm
                    title="确定删除这个条目吗？"
                    @confirm="handleDetailDelete(scope.$index, scope.row)"
                >
                  <el-button
                      class="op-button"
                      slot="reference"
                      size="mini"
                      icon="el-icon-delete"
                      type="danger"
                  ></el-button>
                </el-popconfirm>

              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <!-- 添加字典-->
    <el-dialog title="添加字典" :visible.sync="dialogFormVisible" width="700px">
      <el-form :model="DictForm" :rules="rules" ref="adddictform">
        <el-form-item label="编码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="DictForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="DictForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth" prop="enable">
          <el-switch
              v-model="DictForm.enable"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
          <span>{{DictForm.enable ? '启用' : '禁用'}}</span>
        </el-form-item>

        <el-form-item label="描述" :label-width="formLabelWidth" prop="remark">
          <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="DictForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDict">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑字典-->
    <el-dialog title="编辑字典" :visible.sync="dialogFormVisibleForDictEdit" width="700px">
      <el-form :model="DictForm" :rules="rules" ref="editdictform">
        <el-form-item label="ID" :label-width="formLabelWidth" prop="id">
          <el-input v-model="DictForm.id" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="DictForm.code" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="DictForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否启用" :label-width="formLabelWidth">
          <el-switch
              v-model="DictForm.enable"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
          <span>{{DictForm.enable ? '启用' : '禁用'}}</span>
        </el-form-item>

        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="DictForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleForDictEdit = false">取 消</el-button>
        <el-button type="primary" @click="handleDictEdit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加字典数据-->
    <el-dialog title="添加字典数据" :visible.sync="dialogFormVisibleForDetail" width="700px">
      <el-form :model="DictDetailForm" :rules="rules" ref="adddetailform">

        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="DictDetailForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="DictDetailForm.code" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth" prop="value">
          <el-input v-model="DictDetailForm.value" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否默认" :label-width="formLabelWidth">
          <el-switch
              v-model="DictDetailForm.isDefault"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </el-form-item>

        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="DictDetailForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleForDetail = false">取 消</el-button>
        <el-button type="primary" @click="addDictDetail">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑字典数据-->
    <el-dialog title="编辑字典数据" :visible.sync="dialogFormVisibleForDetailEdit" width="700px">
      <el-form :model="DictDetailForm" :rules="rules" ref="editdetailform">
        <el-form-item label="ID" :label-width="formLabelWidth" prop="id">
          <el-input v-model="DictDetailForm.id" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="名称" :label-width="formLabelWidth" prop="name">
          <el-input v-model="DictDetailForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="编码" :label-width="formLabelWidth" prop="code">
          <el-input v-model="DictDetailForm.code" autocomplete="off" readonly></el-input>
        </el-form-item>
        <el-form-item label="值" :label-width="formLabelWidth" prop="value">
          <el-input v-model="DictDetailForm.value" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="默认" :label-width="formLabelWidth">
          <el-switch
              v-model="DictDetailForm.isDefault"
              active-color="#13ce66"
              inactive-color="#ff4949">
          </el-switch>
        </el-form-item>

        <el-form-item label="描述" :label-width="formLabelWidth">
          <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="DictDetailForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleForDetailEdit = false;">取 消</el-button>
        <el-button type="primary" @click="handleDetailEdit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {deleteRequest, getRequest, postRequest, putRequest} from "@/utils/api";
import Sortable from 'sortablejs'

export default {
  name: "DataDictionary",
  data() {
    // 自定义关键字验证
    let checkValue = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('数值不能为空'));
      } else {
        let ok = true
        for(let item of this.DictDetail) {
          if (item.value == value) {
            ok = false
          }
        }
        if (ok) {
          callback();
        } else {
          return callback(new Error('数值重复'))
        }
      }
    };
    return {
      pageSize: 9,
      currentPage: 1,
      multipleSelection: [],
      DictDetail: [],
      query: '',
      select: '',
      currentSelected: null,
      currentDetailId: null,
      currentDictId: null,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入权限', trigger: 'blur' }
        ],
        code: [{required: true, message: '请输入编码', trigger: 'blur'}],
        value: [{validator: checkValue, trigger: 'blur'}],
      },
      formLabelWidth: '120px',
      dialogFormVisible: false,
      dialogFormVisibleForDetail: false,
      dialogFormVisibleForDetailEdit: false,
      dialogFormVisibleForDictEdit: false,
      dateScopes: [
        '全部',
        '本级',
        '自定义'
      ],
      DictForm: {
        id: 0,
        code: '',
        name: '',
        enable: true,
        remark: '-'
      },
      DictDetailForm: {
        id: 0,
        name: '',
        code: '',
        value: '',
        enable: true,
        sort: 1,
        isDefault: false,
        remark: ''
      },
      TableData: [],
      menus: [],
      currentId: 0, menuLoading: false, showButton: true,
      defaultProps: { children: 'children', label: 'title', isLeaf: 'leaf' },
      menuIds: [], depts: [], deptDatas: [], // 多选时使用
    }
  },
  methods: {
    saveChange() {
      let _this = this
      const data = this.DictDetail
      for(let i = 0;i < data.length;i++) {
        putRequest('/dict/data',{
          id: data[i].id,
          sort: i,
        }).then(resp=>{
          _this.$message(resp.data.msg)
          _this.refreshDictDetail(this.currentSelected)
        })
      }
    },
    moveUp(row,index) {
      if (index > 0) {
        const upDate = this.DictDetail[index - 1]
        this.DictDetail.splice(index - 1, 1)
        this.DictDetail.splice(index, 0, upDate)
      } else {
        this.$message('已经是第一条，不可上移')
      }
    },
    moveDown(row,index) {
      if ((index + 1) === this.DictDetail.length) {
        this.$message('已经是最后一条，不可下移')
      } else {
        const downDate = this.DictDetail[index + 1]
        this.DictDetail.splice(index + 1, 1)
        this.DictDetail.splice(index, 0, downDate)
      }
    },
    rowDrop() {
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const self = this
      Sortable.create(tbody, {
        onEnd({ newIndex, oldIndex }) {
          const currRow = self.DictDetail.splice(oldIndex, 1)[0]
          self.tableData.splice(newIndex, 0, currRow)
        }
      })
    },
    changeDictStatus(row) {
      let _this = this
      console.log('enable',row.enable)
      putRequest('/dict', {
        id: row.id,
        enable: row.enable
      }).then(resp => {
        if(resp.data.status == 200){
          _this.$message({
            message: '状态' + resp.data.msg,
            type: 'success'
          })
        } else {
          _this.$message({
            message: '状态' + resp.data.msg,
            type: 'error'
          })
        }
        _this.getDicts()
      })
    },
    changeDetailStatus(row) {
      let _this = this
      let def = row.isDefault ? true : false
      console.log('def',def)
      putRequest('/dict/data', {
        id: row.id,
        "isDefault": def,
      }).then(resp => {
        if(resp.data.status == 200){
          _this.$message({
            message: '状态' + resp.data.msg,
            type: 'success'
          })
        } else {
          _this.$message({
            message: '状态' + resp.data.msg,
            type: 'error'
          })
        }

        this.refreshDictDetail(this.currentSelected)
      })
    },
    getDictDetail(currentRow) {
      let _this = this
      _this.loading = true
      this.DictDetail = []
      if(currentRow.code !== undefined) {
        _this.DictDetailForm.code = currentRow.code
        _this.currentSelected = currentRow.code
      }
      console.log('当前code',_this.currentSelected)
      getRequest('/dict/' + currentRow.code + '/detail', {}).then(resp => {
        console.log(resp.data.data)
        resp.data.data.sort(function(a,b) { return a.sort - b.sort})
        _this.DictDetail = resp.data.data
        console.log("字典详情",_this.DictDetail)
        _this.loading = false
      })
    },
    refreshDictDetail(current) {
      let _this = this
      console.log('当前的code',current)
      getRequest('/dict/' + current + '/detail',{}).then(resp => {
        _this.DictDetail = resp.data.data.sort(function (a,b) {return a.sort - b.sort})
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
    getDicts: function () {
      let _this = this
      getRequest('/dict',{
        pageNum: this.currentPage,
        pageSize: this.pageSize
      }).then(resp => {
        if (resp.data.status == 200) {
          _this.TableData = resp.data.data
          console.log('角色',_this.TableData)
        } else {
          _this.$message(resp.data.msg)
        }
      })
    },
    deleteSelected() {
    },
    addDict () {
      let _this = this
      this.$refs.adddictform.validate(valid => {
        if (valid) {
          postRequest('/dict', {
            code: _this.DictForm.code,
            name: _this.DictForm.name,
            isDefault: _this.DictForm.isDefault,
            remark: _this.DictForm.remark
          }).then(resp => {
            _this.$message(resp.data.msg)
            _this.getDicts()
          })
          _this.dialogFormVisible = false
        } else {
          _this.$message({
            showClose: true,
            message: '名称与编码为必填项！',
            type: 'error'
          })
        }
      })

    },
    addDictDetail() {
      let _this = this
      console.log('当前表单',_this.DictDetailForm)
      this.$refs.adddetailform.validate(valid => {
        if (valid) {
          postRequest('/dict/data', {
            name: _this.DictDetailForm.name,
            code: _this.DictDetailForm.code,
            value: _this.DictDetailForm.value,
            sort: _this.DictDetailForm.sort,
            remark: _this.DictDetailForm.remark
          }).then(resp => {
            _this.$message(resp.data.msg)
            console.log('表单',_this.DictDetailForm)
            _this.refreshDictDetail(_this.currentSelected)
          })
          _this.dialogFormVisibleForDetail = false
        } else {
          _this.$message({
            message: '请将表单补充完整',
            type: 'error'
          })
        }
      })

    },
    getMenu: function () {
      this.menus = this.$store.state.menus
    },
    handleEdit: function (index, row){
      this.dialogFormVisible = true
      this.DictForm.name = row.name
    },
    handleDelete: function (index, row){
      let _this = this
      deleteRequest('/dict/' + row.id, {}).then(resp => {
        _this.$message(resp.data.msg)
        this.getDicts();
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleDictEdit(index, row) {
      let _this = this
      putRequest('/dict', _this.DictForm).then(resp => {
        _this.$message(resp.data.msg)
      })
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    handleDetailEdit(index, row) {
      let _this = this
      putRequest('/dict/data', _this.DictDetailForm).then(resp => {
        _this.$message(resp.data.msg)
      })
    },
    handleDetailDelete(index, row) {
      let _this = this
      deleteRequest('/dict/data/' + row.id, {}).then(resp => {
        _this.$message(resp.data.msg)
        _this.refreshDictDetail(this.currentSelected)
      })
    }
  },
  mounted() {
    this.rowDrop()
  },
  created() {
    this.getDicts()
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
