<template>
  <div>
    <el-select v-model="prefix">
      <el-option v-for="item in prefixOptions"
                 :key="item"
                 :label="item"
                 :value="item"></el-option>
    </el-select>
    <el-select v-model="tag">
      <el-option v-for="item in tagOptions"
                 :key="item.id"
                 :label="item.name"
                 :value="item.name"></el-option>
    </el-select>
    <el-select v-model="suffix">
      <el-option v-for="item in suffixOptions"
                 :key="item"
                 :label="item"
                 :value="item"></el-option>
    </el-select>
  </div>
</template>

<script>
export default {
name: "tagsSelect",
  computed: {
  tagOptions() {
    return [{'id': 1, 'name': 'smoke'}, {'id': 2, 'name': 'eshop'}]
  }
  },
  data() {
  return {
    prefixOptions: ['', 'not'],
    suffixOptions: ['', 'and', 'or'],
    tag: '',
    prefix: '',
    suffix: ''
  }
  }
}
</script>

<style scoped>

</style>
