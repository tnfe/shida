<template>
  <el-scrollbar class="components-attr-edit">
    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">背景颜色：</p>
      <div class="attr-item-edit-input no-top">
        <el-color-picker
          size="mini"
          :show-alpha="true"
          v-model="activePage.commonStyle.backgroundColor"
        ></el-color-picker>
      </div>
    </div>

    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">场景时长：</p>
      <div class="col-2 attr-item-edit-input">
        <el-input-number
          size="mini"
          v-model="activePage.data.duration"
          controls-position="right"
          :min="1"
          :max="1000"
          :step="0.1"
        />
      </div>
    </div>

    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">过渡动画：</p>
      <pageTrans v-model="activePage.data.trans"></pageTrans>
    </div>

    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">过渡动画时长：</p>
      <div class="col-2 attr-item-edit-input">
        <el-input-number
          size="mini"
          v-model="activePage.data.transDuration"
          controls-position="right"
          :min="0"
          :max="1000"
          :step="0.1"
        />
      </div>
    </div>

    <div class="attr-item-edit-wrapper">
      <p class="attr-item-title">视频尺寸：</p>
      <div class="col-2 attr-item-edit-input">
        <el-input-number size="mini" v-model="projectData.width" controls-position="right" :min="0" />
        <div class="attr-item-edit-input-des">宽度</div>
      </div>
      <div class="col-2 attr-item-edit-input">
        <el-input-number size="mini" v-model="projectData.height" controls-position="right" :min="0" />
        <div class="attr-item-edit-input-des">高度</div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import pageTrans from "./page-trans";

export default {
  components: { pageTrans },
  computed: {
    ...mapState({
      projectData: state => state.editor.projectData,
      activePageUUID: state => state.editor.activePageUUID,
      activeElementUUID: state => state.editor.activeElementUUID
    }),
    ...mapGetters(["activePage"])
  },

  methods: {}
};
</script>

<style lang="scss" scoped>
.components-attr-edit {
  height: 100%;
}

.components-attr-animate-edit {
  position: relative;
}

.attr-title {
  font-weight: bold;
}
.attr-item-edit-wrapper {
  padding-left: 18px;
  display: flex;
  width: 100%;
  text-align: center;
  padding-bottom: 10px;
  .attr-item-title {
    text-align: left;
    min-width: 60px;
    font-size: 12px;
  }
  .attr-item-edit-input {
    &.col-2 {
      width: 90px;
      margin-left: 10px;
    }
    &.col-1 {
      width: 250px;
    }
    &.col-3 {
      width: 60px;
      margin-left: 10px;
    }
    &.col-4 {
      width: 50px;
      margin-left: 10px;
    }
    .attr-item-edit-input-des {
      text-align: center;
      line-height: 1;
      margin-top: 2px;
      font-size: 12px;
      color: $gray;
    }
  }
}
</style>
