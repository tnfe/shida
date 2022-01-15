<template>
  <div class="components-preview">
    <div class="setting-bg"></div>
    <div class="preview-con" v-if="showVideo">
      <div class="center-panel" :style="style()">
        <video controls>
          <source :src="videoUrl" type="video/mp4" />
        </video>
      </div>
      <span class="close-btn" @click="closePanel">
        <i class="el-icon-close"></i>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "preview-page",
  props: {
    videoUrl: String,
    showVideo: Boolean,
    pageData: {
      type: Object,
      require: true,
      default: () => {
        return { width: 0, height: 0 };
      }
    }
  },
  data() {
    return {
      style() {
        const { width, height } = this.pageData;

        return {
          width: width + "px",
          height: height + "px",
          "margin-left": -width / 2 + "px",
          "margin-top": -height / 2 + "px"
        };
      }
    };
  },
  computed: {
    $video() {
      return this.$refs.vueMiniPlayer.$video;
    }
  },
  methods: {
    closePanel() {
      this.$emit("closePanel", false);
    },

    getVideo() {
      return {
        url: this.videoUrl,
        muted: false,
        loop: false,
        preload: "auto",
        volume: 1,
        autoplay: false
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.components-preview-inner {
  width: 100%;
}

.setting-bg {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1042;
}

.center-panel {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: scale(0.8);
  -webkit-transform: scale(0.8);
  z-index: 1050;
  overflow: hidden;
  background-color: #000;
  border: 0px solid #000;
}

.close-btn {
  position: fixed;
  top: 8px;
  right: 20px;
  font-size: 28px;
  color: #7f8593;
  -webkit-transition: all 0.28s;
  transition: all 0.28s;
  z-index: 1060;
  cursor: pointer;
  &:hover {
    color: $primary;
  }
}
</style>
