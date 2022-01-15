<template>
  <div class="qk-bg-music" :class="{ playing: playing }">
    <div class="video-play-audio" v-if="musicSrc">
      <audio ref="audioPlayer" id="video-play-audio" :src="musicSrc" style="opacity: 0;"></audio>
    </div>
    <img class="yinyue-img" src="static/demo/music.png" alt="bg" />
  </div>
</template>

<script>
export default {
  name: "qkBgMusic",
  props: {
    musicSrc: {
      type: String,
      default: "/static/demo/demo.mp3"
    }
  },
  data() {
    return {
      audioEl: undefined,
      playing: false
    };
  },
  created() {},
  mounted() {},
  methods: {}
};
</script>

<style lang="scss" scoped>
.video-play-audio {
  position: absolute;
  left: -9999px;
  top: -9999px;
  width: 0;
  height: 0;
  z-index: -1;
  opacity: 1;
  overflow: hidden;
}

.yinyue-img {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
}

.qk-bg-music {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 10px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  &.playing {
    animation: spin 3s linear infinite;
  }
}

/* 无限旋转 */
@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
