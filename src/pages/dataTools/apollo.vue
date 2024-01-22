<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-select v-model="appId" filterable style="width: 100%;padding-right: 5px" @change="getAppItems">
            <el-option v-for="item in appOptions"
                       :key="item.id"
                       :value="item.appId"
                       :label="item.appId"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="el-icon-refresh" round style="float: left" @click="getAppItems">刷新配置项</el-button>
        </el-col>
      </el-row>
    </el-card>
    <div v-for="(space, index) in tableData" style="margin-top: 15px"
         :key="index"
         :index="index"
         :space="space">
      <el-card>
        <div slot="header" class="title">
          <span>{{ space.namespace }}</span>
          <el-button v-if="space.items.length > 0 && space.editable" style="float: right; padding: 3px;" icon="el-icon-s-promotion"
                     type="success" @click="openRelease(space.namespace)">发布</el-button>
        </div>
        <el-table :data="space.items" style="width: 100%" border v-loading="loading">
          <el-table-column label="发布状态" prop="isModified" width="120">
            <template slot-scope="scope">
              <el-tag :type="scope.row.isModified ? 'warning' : 'info'" effect="dark">{{scope.row.isModified ? '未发布': '已发布'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="key" prop="key" width="180"/>
          <el-table-column label="value" prop="value"/>
          <el-table-column label="备注" prop="comment" width="180"/>
          <el-table-column label="最后修改人" prop="dataChangeLastModifiedBy" width="180"/>
          <el-table-column label="最后修改时间" prop="dataChangeLastModifiedTime" width="180"/>
          <el-table-column label="操作" :width="table1BtnWidth">
            <template slot-scope="scope">
              <table-operator show-edit @editClick="openEdit(scope.row, space.namespace)" :edit-disable="!space.editable"></table-operator>
            </template>
          </el-table-column>
        </el-table>

      </el-card>
    </div>

    <el-dialog :close-on-click-modal="false" :visible.sync="editDialog">
      <template slot="title">
        <div style="text-align: left;">
          <span class="dialog-title">编辑配置项</span>
        </div>
        <el-divider style="width: 100%;"></el-divider>
      </template>
      <el-form ref="editForm" :model="editForm"  label-width="120px">
        <el-form-item label="Key:" prop="key">
          <el-input v-model="editForm.key" style="width: 100%" disabled></el-input>
        </el-form-item>
        <el-form-item label="Value:" prop="value">
          <el-input v-model="editForm.value" type="textarea" style="width: 100%" :rows="8"></el-input>
        </el-form-item>
        <el-form-item label="Comment:" prop="comment">
          <el-input v-model="editForm.comment" type="textarea" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <dialog-footer @cancel="editDialog = false" @confirm="editAppItem"/>
      </template>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="releaseDialog">
      <template slot="title">
        <div style="text-align: left;">
          <span class="dialog-title">发布</span>
          <span style="font-size: 14px;"> (只有发布过的配置才会被客户端获取到，此次发布只会作用于当前环境:FAT)</span>
        </div>
        <el-divider style="width: 100%;"></el-divider>
      </template>

      <el-form ref="releaseForm" :model="releaseForm" :rules="releaseRules" label-width="120px">
        <el-form-item label="Changes:">
          <div v-if="changes.length > 0">
            <el-table :data="changes" border height="200px">
              <el-table-column label="Key" prop="key"/>
              <el-table-column label="已发布的值" prop="oldValue"/>
              <el-table-column label="未发布的值" prop="newValue"/>
              <el-table-column label="修改人" prop="dataChangeLastModifiedBy"/>
            </el-table>
          </div>
          <div v-else>配置没有变化</div>
        </el-form-item>
        <el-form-item label="Release Name:" prop="key">
          <el-input v-model="releaseForm.title" style="width: 50%"></el-input>
        </el-form-item>
        <el-form-item label="Comment:" prop="comment">
          <el-input v-model="releaseForm.comment" type="textarea" style="width: 100%"></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <dialog-footer @cancel="releaseDialog = false" @confirm="releaseAppConfig"/>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {dataToolApi} from "@/api";
import {cloneDeep} from "lodash"
import TableOperator from "@/common/components/TableOperator";
import DialogFooter from "@/common/components/DialogFooter";
import variables from "@/assets/css/utils.scss";
export default {
  name: "apollo",
  components: {TableOperator, DialogFooter},
  data() {
  return {
    editDialog: false,
    releaseDialog: false,
    appId: '',
    changes: [],
    tableData: [],
    releaseForm: {
      comment: '',
      title: ''
    },
    editForm: {
      key: '',
      value: '',
      comment: ''
    },
    releaseRules: {
      title: [{required: true, message: '请输入发布标题', trigger: 'blur'}]
    },
    appOptions: [],
  }
  },
  computed: {
    table1BtnWidth() {
      return variables['table1BtnWidth']
    },
    loading() {
      return this.$store.state.loading
    },
  },
  mounted() {
  this.getAllApps()
  },
  methods: {
  getAllApps() {
    dataToolApi.getApolloApps().then(res => {
      this.appOptions = res.data
      this.appId = this.appOptions[0].appId
      this.getAppItems()
      // console.log('appOption', this.appOptions)
    })
  },
    getAppItems() {
    dataToolApi.getApolloAppItems(this.appId).then(res => {
      this.tableData = res.data
    })
    },
    openEdit(row, namespace) {
    this.editForm = cloneDeep(row)
      this.editForm['namespace'] = namespace
      this.editDialog = true
    },
    // 编辑配置
    editAppItem() {
    dataToolApi.updateApolloAppItem(this.editForm, this.appId).then(() => this.getAppItems()).finally(() => this.editDialog = false)
    },
    // 打开发布表单
    openRelease(namespace) {
    this.changes = []
      var time = new Date().format('yyyyMMddhhmmss')    //先将时间戳转为Date对象，然后才能使用Date的方法
      this.releaseForm.title = time + '_release'
      this.releaseForm['namespace'] = namespace
      this.tableData.forEach(value => {
        if (value['namespace'] === namespace) {
          value['items'].forEach( item => {
            if (item.isModified) {
              this.changes.push({key: item.key, oldValue: item.oldValue, newValue: item.newValue, dataChangeLastModifiedBy: item.dataChangeLastModifiedBy})
            }
          })
        }
      })
      this.releaseDialog = true
    },
    // 发布配置
    releaseAppConfig() {
    const params = this.releaseForm
      params['changes'] = this.changes
    dataToolApi.releaseApolloAppItem(params, this.appId).finally(() => this.releaseDialog = false)
    }
  }
}
</script>

<style scoped lang="scss">

.dialog-title {
  font-weight: 600;
  font-size: 18px;
}

.title {
  font-size: 16px;
  font-weight: 700;
  text-align: left;
}

</style>
