<template>
  <div>
 
    <el-progress class="loader" :stroke-width="10" :percentage="percent" v-if="!showVideo"></el-progress>
    <previewWrapper :pageData="pageData" :videoUrl="videoUrl" :showVideo="showVideo" @closePanel="closePanel" />
    <screenshotLayer @making="making" />
  </div>
</template>

<script>
import previewWrapper from "@client/components/preview-wrapper";
import screenshotLayer from "./screenshot-layer";
import $bus from "@client/eventBus";

export default {
  components: {
    previewWrapper,
    screenshotLayer
  },
  props: {
    pageData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      percent: 0,
      showVideo: false,
      videoUrl: null
    };
  },
  mounted() {
    $bus.$on("publishTemplate", this.publishFun);
  },
  beforeDestroy() {
    $bus.$off("publishTemplate", this.publishFun);
  },
  methods: {
    closePanel() {
      this.$emit("closePanel", false);
    },
    publishFun() {
      console.log("making-panel")
      this.percent = 0;
    },
    saveFn() {
      this.$emit("saveFn");
    },
    making({ progress, state, videoUrl }) {
      this.percent = progress * 100;
      if (state === "complete") {
        this.showVideo = true;
        this.videoUrl = videoUrl;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.preview-info-wrapper {
  padding: 30px 30px 60px;
}

.page-info {
  display: block;
}

.loader {
  position: absolute;
  z-index: 9999;
  left: 50%;
  top: 50%;
  width: 400px;
  margin-left: -200px;
}

.info-form-wrapper {
  display: block;
  width: 90%;
  float: left;
  padding-bottom: 16px;
  .info-form-l {
    line-height: 42px;
    &.com-width {
      width: 120px;
    }
  }
  .info-form-r {
    flex: 1;
    padding-left: 10px;
  }
}

.foot-btn-wrapper {
  position: absolute;
  left: 0;
  bottom: 8px;
  height: 60px;
  padding: 8px 30px;
}

.share-wx-config-wrapper {
  margin-top: 14px;
  padding: 12px;
  background-color: #f0f3f4;
}
</style>
