<template>
  <el-card style="border: none" shadow="never">
    <!--  <div style="text-align:left; display: inline-block; vertical-align: middle;height:100%; padding: 20px;margin: 10% auto">-->
    <el-row class="div-text">
      <el-col :span="11" style="text-align: right;">
        <span class="div-text-font">bug数量: </span>
      </el-col>
      <el-col :span="1">
        <span> &emsp;</span>
      </el-col>
      <el-col :span="12" style="text-align: left;">
        <span class="div-text-import">{{ item.count }}</span><span style="vertical-align: baseline">个</span>
      </el-col>
    </el-row>
    <el-row class="div-text">
      <el-col :span="11" style="text-align: right">
        <span class="div-text-font">人天工作量: </span>
      </el-col>
      <el-col :span="1">
        <span> &emsp;</span>
      </el-col>
      <el-col :span="12" style="text-align: left">
        <span class="div-text-import">{{ item.day }}</span><span style="vertical-align: baseline">天</span>
      </el-col>
    </el-row>
    <!--    <el-row class="div-text">-->
    <!--      <el-col :span="11" style="text-align: right">-->
    <!--        <span class="div-text-font">线下bug分: </span>-->
    <!--      </el-col>-->
    <!--      <el-col :span="1">-->
    <!--        <span> &emsp;</span>-->
    <!--      </el-col>-->
    <!--      <el-col :span="12" style="text-align: left">-->
    <!--        <span class="div-text-import">{{ item.offline_point }}</span><span style="vertical-align: baseline">分</span>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <!--    <el-row class="div-text">-->
    <!--      <el-col :span="11" style="text-align: right">-->
    <!--        <span class="div-text-font">线上bug分: </span>-->
    <!--      </el-col>-->
    <!--      <el-col :span="1">-->
    <!--        <span> &emsp;</span>-->
    <!--      </el-col>-->
    <!--      <el-col :span="12" style="text-align: left">-->
    <!--        <span class="div-text-import">{{ item.online_point }}</span><span style="vertical-align: baseline">分</span>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <!--    <el-row class="div-text">-->
    <!--      <el-col :span="11" style="text-align: right">-->
    <!--        <span class="div-text-font">bug总分: </span>-->
    <!--      </el-col>-->
    <!--      <el-col :span="1">-->
    <!--        <span> &emsp;</span>-->
    <!--      </el-col>-->
    <!--      <el-col :span="12" style="text-align: left">-->
    <!--        <span class="div-text-import">{{ item.point }}</span><span style="vertical-align: baseline">分</span>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <el-row class="div-text">
      <el-col :span="11" style="text-align: right">
        <el-tooltip class="item" effect="dark" placement="bottom">
          <div slot="content" style="line-height: 20px">
            bug指数 = 线下bug分 / 总人天数; <br/>
            线下bug分 = S0_count * 20 + S1_count * 5 + S2_count * 3 + S3_count * 1; <br/>
          </div>

          <i class="el-icon-question"></i>
        </el-tooltip>

        <span class="div-text-font">线下bug指数: </span>
      </el-col>
      <el-col :span="1">
        <span> &emsp;</span>
      </el-col>
      <el-col :span="12" style="text-align: left">
        <span class="div-text-import">{{ item.offlineBugRate }}</span>
      </el-col>
    </el-row>
    <!--    <div class="div-text">-->
    <!--       -->
    <!--    </div>-->
    <!--    <div class="div-text">-->
    <!--      <span class="div-text-font">人天工作量:   </span> <span class="div-text-import">{{ item.day }}</span><span>天</span>-->
    <!--    </div>-->
    <!--    <div class="div-text">-->
    <!--      <span class="div-text-font">bug分数:   </span> <span class="div-text-import">{{ item.point }}</span><span>分</span>-->
    <!--    </div>-->
    <!--    <div class="div-text">-->
    <!--      <span class="div-text-font">人天bug率:   </span> <span class="div-text-import">{{ item.bug_rate }}</span>-->
    <!--    </div>-->
  </el-card>
  <!--  </div>-->
</template>

<script>
export default {
  name: "bugItems",
  props:{
    item: {
      type:Object
    }
  },
  methods: {
    bugRateContent(){
      let content =  "人天bug分数率 = bug总分数/总人天数; \n" +
        "bug总分数 = 线下bug分 + 线上bug分；" +
        "线上bug分 = P0_count*20+P1_count*5+P2_count*3+P3_count*1；" +
        "线下bug分 = S0_count*20+S1_count*5+S2_count*3+S3_count*1；";
      content.replace(/\n/g,"<br/>")
      return content

    }
  }
}

</script>

<style lang="scss" scoped>
.div-text {
  margin: 0 auto;
}
.div-text-font {
  font-size: 16px;
  font-weight: 400;
  vertical-align: baseline;
}
.div-text-import {
  font-size: 20px;
  font-weight: bolder;
  vertical-align: baseline;
}
.div-text-import2 {
  margin-top: 10px;
}

</style>
