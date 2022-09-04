<template>
  <div class="components-script-edit">
    <p class="page-title fontBold">脚本编辑</p>
    <p class="gray paddingL10 fontsize-12">js脚本在编辑模式下无效果</p>
    <div class="paddingT20">
      <el-input type="textarea" :rows="20" v-model="projectData.script" placeholder="请输入代码"></el-input>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  computed: {
    ...mapState({
      projectData: state => state.template.projectData,
      activePageUUID: state => state.template.activePageUUID,
      activeElementUUID: state => state.template.activeElementUUID
    }),
    ...mapGetters('template',["currentPageIndex", "activeElementIndex", "activeElement", "activePage"])
  }
};
</script>

<style scoped></style>
