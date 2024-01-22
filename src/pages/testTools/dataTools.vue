<template>
  <el-card
    v-loading="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-text="拼命加载中"
    style="width: 45%"
  >
    <div>
      <el-form
        ref="dataForm"
        :model="dataForm"
        :rules="dataRules"
        label-position="right"
        label-width="100px"
        style="width: 100%; margin: 20px auto"
      >

        <el-form-item label="环境 :" prop="env">
          <el-select v-model="dataForm.env" class="dataToolFormItem">
            <el-option
              v-for="item in envs"
              :key=item
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="业务场景:" prop="operation">
          <el-cascader
            v-model="dataForm.operation"
            :options="datas"
            :props="optionProps"
            class="dataToolFormItem"
            filterable
            @change="cleardynamicForm"/>
        </el-form-item>

        <el-form-item label="手机号:" prop="mobile" v-if="showPhone">
          <el-autocomplete
            v-model="dataForm.mobile"
            :fetch-suggestions="querySearch"
            class="dataToolFormItem"
            placeholder="请输入手机号"
          />
          <!--          <el-input v-model="dataForm.mobile"></el-input>-->
        </el-form-item>
        <!--        <el-form-item label="openid:" prop="openid">-->
        <!--          <el-input v-model="dataForm.openid"-->
        <!--                    placeholder="手机号、openid、unionId三项必填其一"-->
        <!--                    class="dataToolFormItem"></el-input>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="unionId:" prop="unionId">-->
        <!--          <el-input v-model="dataForm.unionId"-->
        <!--                    placeholder="手机号、openid、unionId三项必填其一"-->
        <!--                    class="dataToolFormItem"></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item
          v-for="(item, index) in dataForm.dynamicForm"
          :key="item.label"
          :label="item.label"
          :prop="'dynamicForm.' + index + '.value'"
        >
          <el-input
            v-model="dataForm.dynamicForm[index].value"
            :placeholder="'请输入'+ item.label"
            class="dataToolFormItem"
            v-bind:type="dataForm.dynamicForm[index].typ"
            :autosize="{ minRows:2, maxRows:10 }"
          />
        </el-form-item>
        <el-form-item label="更新内容:" prop="content" v-if="showPhone">
          <el-input
            v-model="dataForm.content"
            class="dataToolFormItem"
            placeholder="若有指定字段要更新，请输入json格式字符串"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="返回结果:">
          <div class="dataToolFormItem">{{ result }}</div>
        </el-form-item>
        <el-form-item label-width="0" style="text-align: center">
          <el-button type="primary" @click="submitForm">确定</el-button>
          <el-button @click="resetForm('dataForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <!--      <my-dialog :centerDialogVisible="centerDialogVisible"-->
      <!--                  content="确定要删除/更新`${dataForm.mobile}`的数据吗"-->
      <!--                 @callFather="submitFunc"-->
      <!--                 @centerDialogVisible="getCenterDialogVisible"-->
      <!--      ></my-dialog>-->
      <el-dialog title="中台计分查询结果" width="50%" center :visible.sync="showLessonResult">
        <json-viewer :value="lessonResultData" :expand-depth="5" copyable sort></json-viewer>
      </el-dialog>
      <el-dialog
        :visible.sync="centerDialogVisible"
        center
        title="提示"
        width="30%"
      >
        <span>确认要更新/删除{{ dataForm.mobile }}的数据吗？</span>
        <span slot="footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitScene">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </el-card>
</template>

<script>
const _ = require('lodash');
import toolApi from "@/api/tool.js"
import lessonApi from "@/api/toolLesson.js"
// import myDialog from "@/components/myDialog";
export default {
  name: "dataTools",
  // components: {myDialog},
  props: {
    datas: {type: Array}
  },
  data() {
    var checkContent = (rule, value, callback) => {
      try {
        if (value !== '' && typeof JSON.parse(value) === "object") {
          callback()
        } else if (value !== '' && typeof JSON.parse(value) !== "object") {
          return callback(new Error('请输入json字符串'))
        } else {
          callback()
        }
      } catch (e) {
        return callback(new Error('请输入json字符串'))
      }
    }
    // var checkMobile = (rule, value, callback) => {
    //   if(value === '' && this.dataForm.openid === '' && this.dataForm.unionId === '') {
    //     return callback(new Error('手机号、openid、unionId三项至少填一项'))
    //   }else {
    //     callback()
    //   }
    // }
    return {
      loading: false,
      centerDialogVisible: false,
      optionProps: {
        value: 'scene',
        label: 'chineseScene',
        // children: 'children'
      },
      envs: ['dev', 'fat'],
      dataForm: {
        env: 'dev',
        operation: '',
        mobile: '',
        content: '',
        dynamicForm: [],
      },
      dataRules: {
        operation: [{required: true, message: '请选择业务场景', trigger: 'blur'}],
        // mobile: [{required: this.dataForm.dynamicForm, message: '请输入手机号', trigger: 'blur'}],
        content: [{validator: checkContent, trigger: ['blur', 'change']}]
      },
      options: [],
      result: '',
      showPhone: true,
      showLessonResult: false,
      lessonResultData: '',
    }
  },
  watch: {
    'dataForm.operation'() {
      console.log('operation', this.dataForm.operation)
      if (this.dataForm.operation[0] === 'delete_promoter_openidOrUnionId' || this.dataForm.operation[0] === 'delete_wc_users'
        || this.dataForm.operation[0] === 'delete_unionId') {
        this.dataForm.dynamicForm.push({value: '', label: 'openid'})
        this.dataForm.dynamicForm.push({value: '', label: 'unionId'})
      } else if (this.dataForm.operation[0] === 'refund' || this.dataForm.operation[0] === 'trace_seller_ship') {
        this.dataForm.dynamicForm.push({value: '', label: 'oid'})
      } else if (this.dataForm.operation[0] === 'redeem') {
        this.dataForm.dynamicForm.push({value: '', label: 'item_id'})
        this.dataForm.dynamicForm.push({value: '', label: 'num'})
      } else if(this.dataForm.operation[0].startsWith('lesson_')){
        this.showPhone = false
        this.dataForm.dynamicForm.push({value: 'course.course.atom', label: 'server_name', })
        // this.dataForm.dynamicForm.push({value: '9', label: 'uri', typ:'input'})
        this.dataForm.dynamicForm.push({value: '', label: 'params', typ:'textarea'})
      }else if(this.dataForm.operation[0] === 'create_eshop_order') {
        this.dataForm.dynamicForm.push({value: '', label: 'spuNo'})
        this.dataForm.dynamicForm.push({value: '', label: 'promoterId'})
      } else if(this.dataForm.operation[0] === 'create_Sample_order') {
        this.dataForm.dynamicForm.push({value: '', label: 'fanMobile'})
        this.dataForm.dynamicForm.push({value: '', label: 'sp2xuIds'})
      } else if(this.dataForm.operation[0] === 'create_SGU' || this.dataForm.operation[0] === 'create_SPU') {
        this.dataForm.dynamicForm.push({value: '', label: 'title'})
        this.dataForm.dynamicForm.push({value: '', label: 'sgus'})
        this.dataForm.dynamicForm.push({value: '', label: 'skus'})
        this.dataForm.dynamicForm.push({value: '', label: 'price'})
        this.dataForm.dynamicForm.push({value: '', label: 'toolPrice'})
        this.dataForm.dynamicForm.push({value: '', label: 'subCategory'})
      }else if(this.dataForm.operation[0] === 'saturn_bind') {
        this.dataForm.dynamicForm.push({value: '', label: 'channel'})
      }else {
        this.dataForm.dynamicForm = []
      }

    }
  },
  methods: {
    // getScenes() {
    //   toolApi.getScenes().then(res => {
    //     this.options = res.data.map(item => {
    //       return {
    //         chinese_scene: item.project,
    //         scene: item.project,
    //         children: item.datas
    //       }
    //     })
    //   })
    // },
    submitForm() {
      this.setIntoStorage();
      this.$refs.dataForm.validate((valid) => {
        // console.log('valid', valid)
        if (valid) {
          this.centerDialogVisible = true;
        } else {
          return false
        }
      });

    },

    submitScene() {
      this.loading = true
      let body_params = _.cloneDeep(this.dataForm);
      body_params['operation'] = this.dataForm.operation[0]
      body_params['content'] = this.dataForm.content ? JSON.parse(this.dataForm.content) : this.dataForm.content
      this.dataForm.dynamicForm.forEach(item => {
        body_params[item.label] = item.value
      })
      if (body_params['operation'] === 'redeem') {
        toolApi.InterfaceOperateData(body_params).then(res => {
          if (res.data.code === 0) {
            this.result = res.data.data.code;
            console.log(this.result);
          }
        });
      } else if (body_params['operation'] === 'refund' || body_params['operation'] === 'trace_seller_ship') {
        toolApi.InterfaceOperateData(body_params).then();
      } else if(body_params['operation'].startsWith('lesson')){
        lessonApi.lessonOperateData(body_params).then(res => {
          // this.result = res.data
          this.showLessonResult = true
          this.lessonResultData = res.data
        });
      }else if(body_params['operation'].startsWith('ESSync')){
        lessonApi.ESSyncData(body_params).then(res => {
          this.result = res.data
        });
      }else {
        toolApi.preOperateData(body_params).then(res => {
          this.result = res.data
        });
      }
      this.loading = false
      this.centerDialogVisible = false
    },

    resetForm(formName) {
      this.setIntoStorage();
      this.$refs[formName].resetFields();
    },

    cleardynamicForm() {
      this.dataForm.dynamicForm = [];
    },

    querySearch(queryString, cb) {
      var phones = JSON.parse(localStorage.getItem('phoneArr'));
      var results = queryString ? phones.filter(this.createStateFilter(queryString)) : phones;

      // clearTimeout(this.timeout);
      // this.timeout = setTimeout(() => {
      cb(results);
      //   }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (state.value.indexOf(queryString) === 0);
      };
    },

    /**
     * 把输入记录存入localStorage
     */
    setIntoStorage() {
      let phoneArr = [], text = 'phoneArr'  // 手机号历史记录数组
      phoneArr.push({value: this.dataForm.mobile})
      if (JSON.parse(localStorage.getItem(text))) {  // 判断是否已有xxx查询记录的localStorage
        if (localStorage.getItem(text).indexOf(this.dataForm.mobile) > -1) {  // 判断是否已有此条查询记录，若已存在，则不需再存储
          return
        }
        if (JSON.parse(localStorage.getItem(text)).length >= 5) {
          let arr = JSON.parse(localStorage.getItem(text))
          arr.pop()
          localStorage.setItem(text, JSON.stringify(arr))
        }
        localStorage.setItem(text, JSON.stringify(phoneArr.concat(JSON.parse(localStorage.getItem(text)))))
      } else {  // 首次创建
        localStorage.setItem(text, JSON.stringify(phoneArr))
      }

    }

  },
  mounted() {
    // this.getScenes()
    this.setIntoStorage()
  }
}
</script>

<style lang="scss" scoped>

.dataToolFormItem {
  width: 90%;
}

</style>
